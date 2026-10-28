const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function harness({deferDecode = false, webAudio = true} = {}) {
  let now = 0, nextTimer = 0;
  const timers = new Map(), media = [], tones = [], buffers = [], ducks = [], requests = [], contexts = [], decoding = [];
  const param = () => ({value: 0, setValueAtTime(v) { this.value = v; }, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}});
  const node = () => ({connect(other) { this.output = other; }, disconnect() {}, stop() { this.stopped = true; }});
  class Audio {
    constructor(src) { this.src = src; this.readyState = 4; media.push(this); }
    play() { this.played = true; return Promise.resolve(); }
    pause() { this.paused = true; }
    load() { this.loaded = true; }
  }
  class AudioContext {
    constructor() { this.state = 'running'; this.sampleRate = 8000; this.destination = {}; contexts.push(this); }
    get currentTime() { return now / 1000; }
    resume() { return Promise.resolve(); }
    createOscillator() { const n = {...node(), frequency: param(), start(at) { tones.push({at, type: this.type}); }}; return n; }
    createGain() { return {...node(), gain: param()}; }
    createBiquadFilter() { return {...node(), frequency: param(), Q: param()}; }
    createBuffer(_, size) { return {getChannelData: () => new Float32Array(size)}; }
    createBufferSource() { const n = {...node(), playbackRate: param(), start(at, offset, duration) { buffers.push({node: this, kind: this.buffer.kind, volume: this.output?.gain?.value, at, offset, duration, clock: now}); }}; return n; }
    createDynamicsCompressor() { return {...node(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param()}; }
    decodeAudioData(bytes) { const buffer = {duration: 3.5, kind: bytes.kind}; return deferDecode ? new Promise(resolve => decoding.push(() => resolve(buffer))) : Promise.resolve(buffer); }
  }
  const window = {Audio, AudioContext: webAudio ? AudioContext : undefined, fetch: async src => { requests.push(src); return {ok: true, arrayBuffer: async () => ({kind: path.basename(src, '.mp3')})}; }, yomemadoDuckMusic: (...args) => ducks.push(args)};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../template/audio.js'), 'utf8'), {
    window, console, Date: {now: () => now},
    setTimeout(fn, delay) { const id = ++nextTimer; timers.set(id, {at: now + delay, fn}); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  const audio = window.YomemadoAudio.create();
  const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve(); };
  async function advance(to) {
    await flush();
    while (true) {
      const ready = [...timers].filter(([, t]) => t.at <= to).sort((a, b) => a[1].at - b[1].at)[0];
      if (!ready) break;
      const [id, t] = ready; timers.delete(id); now = t.at; t.fn(); await flush();
    }
    now = to; await flush();
  }
  return {audio, media, tones, buffers, ducks, requests, contexts, advance, resolveDecodes: async () => { await flush(); decoding.splice(0).forEach(resolve => resolve()); await flush(); }};
}

test('original sample mapping, levels and accelerated paper flip are retained', async () => {
  const h = harness();
  await h.audio.preload();
  for (const cue of ['tap', 'archive', 'archiveClose', 'save', 'chime', 'switch', 'paper']) h.audio.play(cue);
  assert.deepEqual(h.buffers.map(b => [b.kind, b.volume]), [
    ['coordinate', .79], ['archive_open', .71], ['archive_close', .68],
    ['stamp', .77], ['archive_save', .72], ['switch', .75]
  ]);
  assert.deepEqual(h.media.map(a => [a.src, a.volume, a.playbackRate, a.preservesPitch]), [['assets/sfx/flip.mp3', .56, 1.38, true]]);
  await h.advance(520);
  assert.equal(h.media.at(-1).paused, true);
  assert.deepEqual(h.ducks, [[520, .35]]);
});

test('original dispatch retains its 15 tones, 10 friction bursts and arrival offsets', () => {
  const h = harness(); h.audio.play('mechanism');
  assert.equal(h.tones.length, 15);
  assert.equal(h.buffers.length, 10);
  assert.deepEqual(h.tones.slice(-2).map(t => t.at), [1.25, 1.345]);
  assert.deepEqual(h.ducks, [[1900, .12]]);
});

test('W32 pen uses two original-length passages after the original turn delay', async () => {
  const h = harness(); h.audio.startWriting();
  await h.advance(769); assert.equal(h.buffers.length, 0);
  await h.advance(770); assert.equal(h.buffers.length, 1);
  assert.deepEqual(h.buffers.map(b => [b.clock, b.offset, b.duration]), [[770, 0, 2.18]]);
  await h.advance(3379); assert.equal(h.buffers.length, 1);
  await h.advance(3380);
  assert.deepEqual(h.buffers.map(b => [b.clock, b.offset, b.duration]), [[770, 0, 2.18], [3380, 0, 2.06]]);
  await h.advance(5440); assert.equal(h.buffers.at(-1).node.stopped, true);
});

test('flip-back, close and sound-off can cancel pending and active pen passages', async () => {
  const h = harness(); h.audio.startWriting(); h.audio.stopWriting();
  await h.advance(6000); assert.equal(h.buffers.length, 0);
  h.audio.startWriting(); await h.advance(6770); assert.equal(h.buffers.length, 1);
  h.audio.setEnabled(false); assert.equal(h.buffers[0].node.stopped, true);
  await h.advance(12000); assert.equal(h.buffers.length, 1);
  h.audio.play('tap'); h.audio.play('mechanism'); assert.equal(h.media.some(a => a.played), false); assert.equal(h.tones.length, 0);
});

test('prepared clicks schedule in the gesture without new fetches, decoding or media construction', async () => {
  const h = harness(); await h.audio.preload();
  assert.equal(h.buffers.length, 0); // Preparation must remain silent.
  assert.equal(h.media.some(a => a.played), false);
  assert.equal(h.requests.length, 7); assert.equal(h.media[0].loaded, true);
  h.audio.play('tap');
  assert.equal(h.buffers.length, 1); assert.equal(h.buffers[0].clock, 0); assert.equal(h.buffers[0].at, 0);
  h.audio.play('archive'); h.audio.play('paper'); h.audio.startWriting(); await h.advance(770);
  assert.equal(h.contexts.length, 1); assert.equal(h.requests.length, 7); assert.equal(h.media.length, 1);
});

test('an initial gesture cannot sound late after loading, or after sound is disabled', async () => {
  const h = harness({deferDecode: true}); h.audio.play('tap');
  await h.advance(300); await h.resolveDecodes(); assert.equal(h.buffers.length, 0);
  const other = harness({deferDecode: true}); other.audio.play('tap'); other.audio.setEnabled(false);
  await other.resolveDecodes(); assert.equal(other.buffers.length, 0);
});

test('browsers without Web Audio preload media and retain original sample playback', async () => {
  const h = harness({webAudio: false}); await h.audio.preload();
  assert.equal(h.media.length, 8); assert.equal(h.media.every(a => a.loaded), true);
  h.audio.play('tap');
  assert.equal(h.media.find(a => a.src.endsWith('/coordinate.mp3')).played, true);
});

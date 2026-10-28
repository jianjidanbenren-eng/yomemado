/* Original approved W32 interaction sound set, retained in W51.
 * The eight MP3 files are byte-for-byte extractions of the original effects.
 * Background music is configured separately and is not included here.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.YomemadoAudio = api;
})(typeof window === 'object' ? window : globalThis, function (window) {
  'use strict';
  function create({enabled = true, basePath = 'assets/sfx/'} = {}) {
    let sfxOn = enabled, soundContext = null;
    const samples = {}, transient = new Set();
    const sourceURL = kind => basePath.replace(/\/?$/, '/') + kind + '.mp3';
    function sample(kind, volume = 1) {
      if (!sfxOn) return;
      try {
        let a = samples[kind];
        if (!a) { a = new window.Audio(sourceURL(kind)); a.preload = 'auto'; samples[kind] = a; }
        a.pause();
        if (a.readyState >= 1) { try { a.currentTime = 0; } catch (_) {} }
        a.playbackRate = 1;
        a.volume = Math.max(0, Math.min(1, volume));
        const p = a.play();
        if (p?.catch) p.catch(err => console.warn('Sample playback failed:', kind, err));
        return a;
      } catch (_) {}
    }
    function playSampleSegment(kind, {volume = 1, playbackRate = 1, startAt = 0, stopAfter = 0} = {}) {
      if (!sfxOn) return;
      try {
        const a = new window.Audio(sourceURL(kind)); transient.add(a);
        a.preload = 'auto'; a.volume = Math.max(0, Math.min(1, volume));
        a.playbackRate = playbackRate; a.currentTime = Math.max(0, startAt);
        a.onended = () => transient.delete(a);
        const p = a.play(); if (p?.catch) p.catch(() => transient.delete(a));
        if (stopAfter > 0) setTimeout(() => { try { a.pause(); a.currentTime = 0; } catch (_) {} transient.delete(a); }, stopAfter);
        return a;
      } catch (_) {}
    }
    function initSound() {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      if (!soundContext) soundContext = new C();
      if (soundContext.state === 'suspended') soundContext.resume().catch(() => {});
      return soundContext;
    }
    // ORIGINAL_V3_BEGIN: retained verbatim from the approved machine.
  function v3Tone(freq,offset,length,volume,type='sine',fall=0){
    const c=soundContext,t=c.currentTime+offset,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,t);
    if(fall)o.frequency.exponentialRampToValueAtTime(Math.max(70,freq-fall),t+length);
    g.gain.setValueAtTime(.00001,t);
    g.gain.linearRampToValueAtTime(volume,t+Math.min(.009,length*.23));
    g.gain.exponentialRampToValueAtTime(.00001,t+length);
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+length+.03);
  }
  function v3Rustle(offset,length,volume,freq,filterType='bandpass'){
    const c=soundContext,n=Math.ceil(c.sampleRate*length),buf=c.createBuffer(1,n,c.sampleRate),ch=buf.getChannelData(0);
    for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(.7+.3*Math.sin(i/c.sampleRate*87));
    const src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+offset;
    src.buffer=buf;f.type=filterType;f.frequency.value=freq;f.Q.value=.65;
    g.gain.setValueAtTime(.00001,t);g.gain.linearRampToValueAtTime(volume,t+Math.min(.014,length*.22));
    g.gain.exponentialRampToValueAtTime(.00001,t+length);
    src.connect(f);f.connect(g);g.connect(c.destination);src.start(t);src.stop(t+length+.012);
  }
  function v3Dispatch(){
    if(!initSound())return;
    window.yomemadoDuckMusic?.(1900,.12);
    v3Tone(225,0,.09,.095,'triangle',135);
    v3Rustle(.006,.066,.18,830,'lowpass');
    [0.100,0.179,0.256].forEach((d,i)=>v3Tone(900+i*140,d,.060,.039,'sine',55));
    for(let i=0;i<8;i++){
      const d=.34+i*.071;
      v3Rustle(d,.053,.094+(i%3)*.008,1100+(i%2)*220);
      v3Tone(230,d+.007,.040,.021,'triangle',100);
    }
    v3Rustle(.945,.205,.17,2400,'highpass');
    v3Tone(415,1.030,.11,.035,'triangle',190);
    v3Tone(784,1.25,.38,.050,'sine');v3Tone(1047,1.345,.42,.037,'sine');
  }
    // ORIGINAL_V3_END
    function playSfx(kind = 'tap') {
      if (!sfxOn) return;
      if (kind === 'mechanism') return v3Dispatch();
      if (kind === 'arrival') return;
      if (kind === 'tap') return sample('coordinate', .79);
      if (kind === 'paper') { window.yomemadoDuckMusic?.(520, .35); return playSampleSegment('flip', {volume: .56, playbackRate: 1.38, stopAfter: 520}); }
      if (kind === 'archive') return sample('archive_open', .71);
      if (kind === 'archiveClose') return sample('archive_close', .68);
      if (kind === 'save') return sample('stamp', .77);
      if (kind === 'chime') return sample('archive_save', .72);
      if (kind === 'switch') return sample('switch', .75);
      if (kind === 'pickup') {
        if (!initSound()) return sample('flip', .48);
        window.yomemadoDuckMusic?.(480, .35);
        v3Rustle(0, .16, .19, 1850, 'bandpass');
        v3Rustle(.075, .16, .12, 2550, 'bandpass');
        v3Tone(330, .17, .045, .006, 'triangle', 80);
      }
    }

    // W32 uses the clear opening of the same pen sample for both passages.
    const WRITER_FIRST_DELAY = 770, WRITER_PASSAGES_MS = [2180, 2060], WRITER_PAUSE_MS = 430;
    let penContext = null, penBufferPromise = null, activePen = null, writeToken = 0;
    const writerTimers = new Set();
    function getPenContext() {
      try {
        if (!penContext) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; penContext = new C(); }
        if (penContext.state === 'suspended') penContext.resume().catch(() => {});
        return penContext;
      } catch (_) { return null; }
    }
    function preparePen() {
      const ctx = getPenContext(); if (!ctx) return null;
      if (!penBufferPromise) penBufferPromise = window.fetch(sourceURL('pen'))
        .then(r => { if (!r.ok) throw Error('Pen sample HTTP ' + r.status); return r.arrayBuffer(); })
        .then(bytes => ctx.decodeAudioData(bytes))
        .catch(err => { penBufferPromise = null; console.warn('Pen effect unavailable', err); return null; });
      return penBufferPromise;
    }
    function stopPen() {
      if (activePen) { try { activePen.stop(); activePen.disconnect(); } catch (_) {} activePen = null; }
    }
    function stopWriting() {
      writeToken++; for (const t of writerTimers) clearTimeout(t); writerTimers.clear(); stopPen();
    }
    function later(fn, delay) {
      const t = setTimeout(() => { writerTimers.delete(t); fn(); }, delay); writerTimers.add(t);
    }
    async function penForPassage(token, ms) {
      if (!sfxOn || token !== writeToken) return;
      const ctx = getPenContext(); if (!ctx) return;
      const buffer = await preparePen();
      if (!buffer || !sfxOn || token !== writeToken) return;
      try {
        stopPen();
        const source = ctx.createBufferSource(); source.buffer = buffer;
        const compressor = ctx.createDynamicsCompressor(); compressor.threshold.value = -25; compressor.knee.value = 16;
        compressor.ratio.value = 3.3; compressor.attack.value = .008; compressor.release.value = .12;
        const gain = ctx.createGain(), now = ctx.currentTime, seconds = ms / 1000;
        gain.gain.setValueAtTime(.001, now); gain.gain.linearRampToValueAtTime(.90, now + .06);
        gain.gain.setValueAtTime(.90, now + Math.max(.08, seconds - .14));
        gain.gain.linearRampToValueAtTime(.001, now + seconds);
        source.connect(compressor); compressor.connect(gain); gain.connect(ctx.destination);
        source.start(now, 0, Math.min(seconds, buffer.duration));
        source.onended = () => { if (activePen === source) activePen = null; try { source.disconnect(); compressor.disconnect(); gain.disconnect(); } catch (_) {} };
        activePen = source; window.yomemadoDuckMusic?.(ms + 180, .10);
      } catch (err) { console.warn('Pen effect unavailable', err); }
    }
    function startWriting() {
      stopWriting(); if (!sfxOn) return;
      preparePen(); // Resume synchronously inside the flip gesture, including on mobile.
      const token = writeToken;
      function passage(index) {
        if (!sfxOn || token !== writeToken) return;
        const duration = WRITER_PASSAGES_MS[index]; penForPassage(token, duration);
        later(() => { if (token !== writeToken) return; stopPen(); if (index + 1 < WRITER_PASSAGES_MS.length) later(() => passage(index + 1), WRITER_PAUSE_MS); }, duration);
      }
      later(() => passage(0), WRITER_FIRST_DELAY);
    }
    function setEnabled(on) {
      sfxOn = Boolean(on);
      if (!sfxOn) { stopWriting(); for (const a of [...Object.values(samples), ...transient]) if (a !== samples.switch) a.pause(); transient.clear(); }
    }
    return {play: playSfx, setEnabled, startWriting, stopWriting};
  }
  return {create};
});

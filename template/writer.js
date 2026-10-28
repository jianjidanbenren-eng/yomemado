/* W32: reveal each paragraph with its pen passage, then reveal the signature.
 * The existing back PNG supplies the paper, header and footer and stays intact
 * for downloads. Only its flat body area is covered by the live text layer.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.YomemadoWriter = api;
})(typeof window === 'object' ? window : globalThis, function (window) {
  'use strict';
  function create({host, audio, isActive}) {
    const document = host.ownerDocument;
    let surface, body, sign, paragraphs = [], signature = '', frame = null, generation = 0;
    function cancelFrame() { if (frame !== null) window.cancelAnimationFrame(frame); frame = null; }
    function paragraph(text) { const el = document.createElement('span'); el.className = 'ym-writing-paragraph'; el.textContent = text; return el; }
    function fullText() {
      if (!surface) return;
      body.replaceChildren(...paragraphs.map(paragraph)); sign.textContent = signature;
      sign.style.opacity = '1'; surface.dataset.writing = 'complete';
    }
    function stop() { generation++; cancelFrame(); audio.stopWriting(); fullText(); }
    function setLetter(letter) {
      stop();
      surface?.remove();
      paragraphs = letter.paragraphs.slice(); signature = letter.signature || '—— 游目窗';
      surface = document.createElement('div'); surface.className = 'reader-writing-surface';
      surface.setAttribute('role', 'group'); surface.setAttribute('aria-label', paragraphs.join('\n\n') + '\n' + signature);
      body = document.createElement('div'); body.className = 'reader-letter'; body.setAttribute('aria-hidden', 'true');
      sign = document.createElement('div'); sign.className = 'reader-sign'; sign.setAttribute('aria-hidden', 'true');
      surface.append(body, sign); host.appendChild(surface); fullText();
    }
    function start() {
      stop(); if (!surface || !isActive()) return;
      const token = generation;
      body.replaceChildren(); sign.style.opacity = '0'; surface.dataset.writing = 'waiting';
      audio.startWriting({
        passageCount: paragraphs.length,
        onPassage(index, duration) {
          if (token !== generation || !isActive()) { stop(); return; }
          cancelFrame();
          if (index > 0) body.children[index - 1].textContent = paragraphs[index - 1];
          const section = paragraph(''), characters = Array.from(paragraphs[index]);
          body.appendChild(section); surface.dataset.writing = 'passage-' + (index + 1);
          const began = window.performance.now();
          function paint(now) {
            if (token !== generation || !isActive()) return;
            const fraction = Math.min(1, (now - began) / duration);
            section.textContent = characters.slice(0, Math.max(1, Math.ceil(fraction * characters.length))).join('');
            if (fraction < 1) frame = window.requestAnimationFrame(paint); else frame = null;
          }
          paint(began); // First character and pen passage start in the same callback.
        },
        onComplete() { if (token === generation && isActive()) { cancelFrame(); fullText(); } }
      });
    }
    return {setLetter, start, stop};
  }
  return {create};
});

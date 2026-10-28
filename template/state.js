(function (root) {
  'use strict';
  const identity = l => [l.id, l.date, l.place, l.title, l.frontImage, l.backImage].join('|');
  const liveLetters = letters => letters.filter(l => l.testOnly !== true).slice().sort((a,b) => a.id.localeCompare(b.id));
  function stateFor(letters, saved, initialIds, letter) {
    const live = liveLetters(letters);
    const newest = live.at(-1)?.id;
    const initial = new Set(initialIds || []);
    const automatic = letter.testOnly !== true && letter.id !== newest;
    const local = saved.letters?.[letter.id] || {};
    const same = local.manualCollectedFor === identity(letter);
    const collected = initial.has(letter.id) || automatic || same;
    return { collected, read: collected || local.readFor === identity(letter) };
  }
  const api = { identity, stateFor, liveLetters };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.YomemadoState = api;
})(typeof window !== 'undefined' ? window : this);

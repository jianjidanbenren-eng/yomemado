const {test} = require('node:test');
const assert = require('node:assert/strict');
const {stateFor, identity} = require('../template/state.js');
const letter = id => ({id, date:'2026-10-28', title:id, place:'Place', frontImage:id+'-front.png', backImage:id+'-back.png'});
const six = Array.from({length:6},(_,i)=>letter(String(i+1).padStart(3,'0')));
const seven = [...six,letter('007')];
const archived = (ls,saved={letters:{}}) => ls.filter(l=>stateFor(ls,saved,[],l).collected).map(l=>l.id);
test('new seventh letter yields six archived READ letters, latest stays manual',()=>{
  assert.deepEqual(archived(seven),six.map(l=>l.id));
  for(const l of six)assert.equal(stateFor(seven,{letters:{}},[],l).read,true);
  assert.deepEqual(stateFor(seven,{letters:{}},[],seven.at(-1)),{read:false,collected:false});
});
test('stale collected flag cannot collect newest; explicit content-bound action can',()=>{
  assert.equal(stateFor(seven,{letters:{'007':{collected:true}}},[],seven.at(-1)).collected,false);
  const saved={letters:{'007':{manualCollectedFor:identity(seven.at(-1))}}};
  assert.equal(stateFor(seven,saved,[],seven.at(-1)).read,true);
  const replacement={...seven.at(-1),frontImage:'new-art.png'};
  assert.equal(stateFor([...six,replacement],saved,[],replacement).collected,false);
});
test('withdrawal recomputes old-letter automatic state; TEST is excluded',()=>{
  assert.deepEqual(archived(six),six.slice(0,-1).map(l=>l.id));
  const fixture={...letter('008'),testOnly:true};
  assert.deepEqual(archived([...six,fixture]),six.slice(0,-1).map(l=>l.id));
});

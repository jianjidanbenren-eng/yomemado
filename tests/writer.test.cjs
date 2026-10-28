const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');

function fixture() {
  let now = 0, active = true, next = 0, hooks;
  const frames = new Map();
  class Element {
    constructor(doc) { this.ownerDocument=doc; this.children=[]; this.style={}; this.dataset={}; this.attributes={}; this.text=''; }
    set textContent(value) { this.text=value; this.children=[]; }
    get textContent() { return this.text+this.children.map(c=>c.textContent).join(''); }
    setAttribute(key,value) { this.attributes[key]=value; }
    append(...children) { children.forEach(child=>this.appendChild(child)); }
    appendChild(child) { child.parent=this; this.children.push(child); }
    replaceChildren(...children) { this.text=''; this.children=[]; this.append(...children); }
    remove() { if(this.parent) this.parent.children=this.parent.children.filter(c=>c!==this); }
  }
  const doc={createElement:()=>new Element(doc)}, host=new Element(doc);
  const audio={stopWriting(){},startWriting(options){hooks=options;}};
  const window={performance:{now:()=>now},requestAnimationFrame(fn){const id=++next;frames.set(id,fn);return id;},cancelAnimationFrame(id){frames.delete(id);}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../template/writer.js'),'utf8'),{window});
  const writer=window.YomemadoWriter.create({host,audio,isActive:()=>active});
  const letter={paragraphs:['甲乙丙丁戊己','一二三四五六'],signature:'—— 游目窗'};
  writer.setLetter(letter);
  return {writer,host,letter,get hooks(){return hooks;},get surface(){return host.children.at(-1);},tick(ms){now=ms;const due=[...frames.values()];frames.clear();due.forEach(fn=>fn(now));},deactivate(){active=false;}};
}

test('W32 text starts empty, reveals two paragraphs gradually and reveals the signature last',()=>{
  const h=fixture(), body=h.surface.children[0], sign=h.surface.children[1];
  h.writer.start(); assert.equal(body.textContent,''); assert.equal(sign.style.opacity,'0');
  h.hooks.onPassage(0,2180); assert.equal(body.textContent,'甲');
  h.tick(1090); assert.equal(body.textContent,'甲乙丙'); assert.equal(sign.style.opacity,'0');
  h.tick(2180); assert.equal(body.textContent,h.letter.paragraphs[0]);
  h.hooks.onPassage(1,2060); assert.equal(body.children.length,2);
  h.tick(3210); assert.equal(body.children[1].textContent,'一二三');
  h.tick(4240); h.hooks.onComplete();
  assert.equal(body.textContent,h.letter.paragraphs.join('')); assert.equal(sign.style.opacity,'1');
  assert.equal(h.surface.dataset.writing,'complete');
});

test('closing, flipping back and switching letters cancel stale writing and keep full text',()=>{
  const h=fixture(); h.writer.start(); const stale=h.hooks;
  stale.onPassage(0,2180); h.writer.stop(); h.tick(5000);
  assert.equal(h.surface.children[0].textContent,h.letter.paragraphs.join(''));
  h.deactivate(); stale.onPassage(1,2060);
  assert.equal(h.surface.children[1].style.opacity,'1');
  h.writer.setLetter({paragraphs:['新的一封'],signature:'新落款'});
  assert.equal(h.host.children.length,1); assert.equal(h.surface.children[0].textContent,'新的一封');
  stale.onComplete(); assert.equal(h.surface.children[0].textContent,'新的一封');
});

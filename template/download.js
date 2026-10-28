
/* 一次存图 = 高清正反面 PNG 的 ZIP；零 CDN、零第三方代码。 */
(()=>{
  const btn=document.getElementById('downloadBothBtn');
  const info=document.getElementById('downloadFeedback');
  const current=()=>window.yomemadoActiveLetter;
  async function pngBytes(_templateId,url){
    const r=await fetch(url);if(!r.ok)throw new Error('PNG HTTP '+r.status);
    const data=new Uint8Array(await r.arrayBuffer());
    if(data[0]!==137||data[1]!==80||data[2]!==78||data[3]!==71)throw new Error('Not a PNG');
    return data;
  }
  const table=new Uint32Array(256);
  for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0;}
  function crc32(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=table[(c^bytes[i])&255]^(c>>>8);return(c^0xffffffff)>>>0;}
  function zipPair(items){
    const enc=new TextEncoder(),parts=[],central=[];let pos=0;
    function header(length){return new DataView(new ArrayBuffer(length));}
    function toBytes(dv){return new Uint8Array(dv.buffer);}
    const now=new Date(),time=((now.getHours()&31)<<11)|((now.getMinutes()&63)<<5)|((now.getSeconds()/2)|0);
    const date=(((now.getFullYear()-1980)&127)<<9)|(((now.getMonth()+1)&15)<<5)|(now.getDate()&31);
    for(const item of items){
      const name=enc.encode(item.name),data=item.data,crc=crc32(data),offset=pos;
      const h=header(30+name.length);h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,time,true);h.setUint16(12,date,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,name.length,true);
      let hb=toBytes(h);hb.set(name,30);parts.push(hb,data);pos+=hb.length+data.length;
      const c=header(46+name.length);c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,time,true);c.setUint16(14,date,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);let cb=toBytes(c);cb.set(name,46);central.push(cb);
    }
    const centSize=central.reduce((v,b)=>v+b.length,0),end=header(22);
    end.setUint32(0,0x06054b50,true);end.setUint16(8,items.length,true);end.setUint16(10,items.length,true);end.setUint32(12,centSize,true);end.setUint32(16,pos,true);
    return new Blob([...parts,...central,toBytes(end)],{type:'application/zip'});
  }
  btn.addEventListener('click',async()=>{
    btn.disabled=true;const label=btn.querySelectorAll('span')[1];label.textContent='整理中';
    try{
      const l=current();if(!l)throw new Error('No selected letter');
      const [front,back]=await Promise.all([pngBytes(l.frontTemplateId,l.frontImage),pngBytes(l.backTemplateId,l.backImage)]);
      const zipped=zipPair([{name:l.id+'-正面.png',data:front},{name:l.id+'-背面.png',data:back}]);
      const url=URL.createObjectURL(zipped),a=document.createElement('a');
      a.href=url;a.download='游目窗-'+l.id+'-双面邮票.zip';document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),20000);
      window.yomemadoPlaySfx?.('save');window.yomemadoNotify?.('正反两面已装入同一份 ZIP，请查看下载记录。');
      info.textContent='已保存双面高清邮票';
    }catch(err){console.error('Postcard ZIP export failed:',err);window.yomemadoNotify?.('存图未成功，请换 Chrome / Edge 重试。');info.textContent='存图失败';}
    finally{label.textContent='存图';btn.disabled=false;}
  });
})();

import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFile(new URL(p,import.meta.url),'utf8');
const context={};vm.createContext(context);
vm.runInContext(await read('source/turret-model.js'),context);
const M=context.TurretModel,app=await read('source/turret-app.js');
context.M=M;context.V=M.V;context.state={view:'assembly',cutaway:true};
vm.runInContext(app.slice(app.indexOf('function basis('),app.indexOf('function draw(')),context);
let cases=0,baseline,maxError=0;
for(const lat of [0,20,40,65])for(let h=-180;h<=180;h+=3)for(const dec of [-23.4,0,23.4]){
  const u=M.sky(h,dec,lat),g=M.geometry('gong',u,lat);
  assert.equal(g.ray.length,4);assert(!g.n3);
  assert(M.V.norm(M.V.sub(g.exit,M.LAB_ENTRY))<1e-12);
  assert(M.V.norm(M.V.sub(g.outgoing,M.LAB_DIRECTION))<1e-10);
  assert(M.V.norm(M.V.sub(M.fromGong(g.first,g.second),u))<1e-10);
  assert(Math.abs(Math.abs(M.V.dot(g.n1,g.q))-Math.SQRT1_2)<1e-10);
  const lab=JSON.stringify(context.makeMesh(g).filter(f=>f.id.startsWith('lab-')));
  if(baseline===undefined)baseline=lab;else assert.equal(lab,baseline);
  maxError=Math.max(maxError,g.reflectionError);cases++;
}
assert(!app.includes('Stationary relay fold'));
console.log(JSON.stringify({cases,maxError,twoMirrors:true,fixedLabGeometry:true,fixedHorizontalFeed:true}));

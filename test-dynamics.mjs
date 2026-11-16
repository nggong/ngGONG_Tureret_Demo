import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx={};vm.createContext(ctx);vm.runInContext(await fs.readFile(new URL('source/dynamics.js',import.meta.url),'utf8'),ctx);
const D=ctx.TurretDynamics;
let worstAngle=0,worstTorque=0;
for(const p of [{m:20,l:.7,J:8,Ix:1.2,Iy:1.8,Iz:2},{m:80,l:1.5,J:.1,Ix:20,Iy:10,Iz:15},{m:1,l:.1,J:80,Ix:.05,Iy:.05,Iz:.05}]){
  const r=D.simulate(p),fine=D.simulate(p,.005);
  assert(r.maxQ<1e-6);assert(r.maxT<1e-3);
  const last=r.rows.at(-1),lastFine=fine.rows.at(-1),ref=D.reference(12);
  assert(Math.max(...last.L.q.map((v,i)=>Math.abs(v-ref.q[i])))<1e-7);
  assert(Math.max(...last.H.q.map((v,i)=>Math.abs(v-lastFine.H.q[i])))<1e-6);
  worstAngle=Math.max(worstAngle,r.maxQ);worstTorque=Math.max(worstTorque,r.maxT);
  // Transform a Hamiltonian derivative back to accelerations at an arbitrary state.
  const q=[-.4,.3],v=[.2,-.1],{A,Ap}=D.terms(q,p),L=[...q,...v],H=[...q,A*v[0],p.Iz*v[1]],dl=D.derivative(.7,L,p,'L'),dh=D.derivative(.7,H,p,'H');
  assert(Math.abs(dl[2]-(dh[2]-Ap*v[1]*v[0])/A)<1e-10);
  assert(Math.abs(dl[3]-dh[3]/p.Iz)<1e-10);
}
// At rest the primary motor balances gravity; secondary torque is zero.
const p={m:20,l:.7,J:8,Ix:1.2,Iy:1.8,Iz:2};
const {G}=D.terms([-.4,0],p);assert(G>0);
console.log(JSON.stringify({parameterCases:3,transformedDerivativesAgree:true,stepHalving:true,maxAngleDifference_rad:worstAngle,maxTorqueDifference_Nm:worstTorque}));
for(const [limitA,limitB] of [[150,1],[40,.05],[0,0]]){
  const params={...p,limitA,limitB},r=D.simulate(params),fine=D.simulate(params,.005);
  assert(r.rows.every(row=>[...row.L.q,...row.H.q,...row.al,...row.ah].every(Number.isFinite)));
  for(const row of r.rows)for(let k=0;k<2;k++){
    const lim=k?limitB:limitA;assert(Math.abs(row.al[k])<=lim+1e-12);assert(Math.abs(row.ah[k])<=lim+1e-12);
  }
  assert(r.maxQ<1e-5);
  assert(Math.max(...r.rows.at(-1).L.q.map((v,k)=>Math.abs(v-fine.rows.at(-1).L.q[k])))<1e-4);
  if(limitA===150){assert(r.peakError[0]<1e-7);assert(r.saturation[0]===0);}
  else {assert(r.peakError[0]>.1);assert(r.saturation[0]>.1);}
  console.log(JSON.stringify({limitA,limitB,peakError_rad:r.peakError,saturatedFraction:r.saturation,maxLH_rad:r.maxQ}));
}

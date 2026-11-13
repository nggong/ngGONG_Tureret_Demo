import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFile(path.join(root,p),'utf8');
const [template,model,app,shell,data,png]=await Promise.all([
  read('source/turret-template.html'),read('source/turret-model.js'),
  read('source/turret-app.js'),read('source/standalone-template.html'),
  read('data/turret_example_calculations.json'),fs.readFile(path.join(root,'assets/turret-reference.png'))
]);
const fragment=template.replace('__REFERENCE_IMAGE__','data:image/png;base64,'+png.toString('base64'))
  .replace('/*__TURRET_MODEL__*/',()=>model)
  .replace('/*__TURRET_APP__*/',()=>app.replace('/*__E1_DATA__*/null',JSON.stringify(JSON.parse(data))));
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
await fs.writeFile(path.join(root,'index.html'),shell.replace('__FRAGMENT__',()=>escape(fragment.trim())));
console.log('Built index.html; ready for GitHub Pages.');

import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const attr of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const u=attr[1];if(/^(https?:|tel:|data:)/.test(u))continue;
 if(u.startsWith('#')){if(u.length>1&&!html.includes('id="'+u.slice(1)+'"'))throw Error('Missing anchor '+u);continue;}
 if(!fs.existsSync(path.join(root,u.split("?")[0])))throw Error('Missing file '+u);
}
if(!html.includes('lang="ru"')||!html.includes('name="viewport"')||!html.includes('noindex'))throw Error('Missing metadata');
if((html.match(/<h1[ >]/g)||[]).length!==1)throw Error('Expected one h1');
if(!html.includes('tel:')&&!html.includes('wa.me'))throw Error('No contact action');
for(const img of html.matchAll(/<img\b[^>]*>/g))if(!/alt="[^"]+"/.test(img[0])||!img[0].includes('width=')||!img[0].includes('height='))throw Error('Image accessibility/dimensions');
console.log('Production static validation passed: entrypoint, assets, anchors, metadata, contacts, image dimensions.');

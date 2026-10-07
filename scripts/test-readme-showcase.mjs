import fs from 'node:fs';
import assert from 'node:assert/strict';

const readme=fs.readFileSync('README.md','utf8');
for(const p of ['assets/readme/mon-summary.svg','assets/readme/mon-features.svg']){
 assert.ok(fs.existsSync(p),p+' missing');
 const svg=fs.readFileSync(p,'utf8');
 assert.ok(svg.startsWith('<svg'));
 assert.ok(svg.includes('role="img"'));
 assert.ok(readme.includes(p),p+' not referenced by README');
}
for(const label of ['Orientação da Home','Motor de Próxima Lição','Memória de Kanji · 字','Escuta e Pronúncia · 聴','Missões Reais · 旅','Diário no Japão','Laboratório de Desempenho'])assert.ok(readme.includes(label),label+' missing from README');
assert.ok(readme.includes('docs/ROADMAP.md'));
console.log('MON README showcase contracts passed');

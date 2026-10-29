// The gallery is generated from the registry, so a build that silently dropped a design
// would still look fine. This checks the built page against the built registry: every
// design must appear as a card, and the stylesheet must be embedded once rather than
// linked, because the deployed artifact is a single file.
import { readFile } from 'node:fs/promises';
import { loaderRegistry } from '../packages/core/dist/registry.js';

const html = await readFile('apps/docs/dist/index.html', 'utf8');
const missing = loaderRegistry.filter((loader) => !html.includes(`type: '${loader.id}'`)).map((loader) => loader.id);
if (missing.length) throw new Error(`gallery is missing ${missing.length} design(s): ${missing.join(', ')}`);

if (!html.includes('<style>')) throw new Error('gallery does not embed its stylesheet; the deployed page would be unstyled');
if (/<link[^>]+stylesheet/.test(html)) throw new Error('gallery links an external stylesheet; the deployed single file would 404');

const cards = html.split('class="card').length - 1;
if (cards < loaderRegistry.length) throw new Error(`gallery rendered ${cards} cards for ${loaderRegistry.length} designs`);

console.log(`Gallery is complete: ${cards} cards, ${loaderRegistry.length} designs, stylesheet embedded.`);

// Checks the Make app blocks: every file is valid JSON, every component listed in app.json has its files,
// and every module, webhook and RPC reference points to something that exists.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const errors = [];
const json = (path) => {
	try {
		return JSON.parse(readFileSync(path, 'utf8'));
	} catch (err) {
		errors.push(`${path}: ${err.message}`);
		return null;
	}
};
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

for (const file of walk('app').filter((f) => f.endsWith('.json'))) json(file);
const app = json('app.json');
const need = (path) => existsSync(path) || errors.push(`missing ${path}`);

need('app/base.iml.json');
for (const f of ['communication', 'parameters']) need(`${app.connection.files}/${f}.iml.json`);
for (const hook of app.webhooks) for (const f of ['communication', 'parameters', 'attach', 'detach']) need(`${hook.files}/${f}.iml.json`);
for (const rpc of app.rpcs) need(`${rpc.files}/communication.iml.json`);

const webhooks = new Set(app.webhooks.map((h) => h.name));
const rpcs = new Set(app.rpcs.map((r) => r.name));
for (const mod of app.modules) {
	const dir = `app/modules/${mod.name}`;
	const files = ['static-parameters', 'mappable-parameters', 'interface', 'samples'];
	if (mod.type !== 'Instant trigger') files.push('communication');
	else if (!webhooks.has(mod.webhook)) errors.push(`${mod.name}: unknown webhook ${mod.webhook}`);
	for (const f of files) need(`${dir}/${f}.iml.json`);
	if (!existsSync(dir)) continue;
	for (const f of walk(dir)) {
		for (const [, name] of readFileSync(f, 'utf8').matchAll(/rpc:\/\/(\w+)/g)) if (!rpcs.has(name)) errors.push(`${f}: unknown RPC ${name}`);
	}
}
const grouped = new Set(app.groups.flatMap((g) => g.modules));
for (const mod of app.modules) if (!grouped.has(mod.name)) errors.push(`${mod.name} is in no group`);

if (errors.length) {
	console.error(errors.join('\n'));
	process.exit(1);
}
console.log(`ok - ${app.modules.length} modules, ${app.webhooks.length} webhook, ${app.rpcs.length} RPC`);

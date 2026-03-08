const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components/theme/6');
function go(d) {
    for (let f of fs.readdirSync(d)) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) go(p);
        else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
            let content = fs.readFileSync(p, 'utf8');
            if (content.includes('--t5-')) {
                content = content.replace(/--t5-/g, '--t6-');
                fs.writeFileSync(p, content);
            }
        }
    }
}
go(dir);

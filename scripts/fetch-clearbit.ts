import fs from 'fs';
import path from 'path';

const brands = [
    { name: 'weber', domain: 'weber.com' },
    { name: 'dimplex', domain: 'dimplex.com' },
    { name: 'heatnglo', domain: 'heatnglo.com' },
    { name: 'heatilator', domain: 'heatilator.com' },
    { name: 'ortal', domain: 'ortalheat.com' }
];

async function fetchClearbit() {
    for (const b of brands) {
        console.log(`Fetching ${b.domain}...`);
        try {
            const res = await fetch(`https://logo.clearbit.com/${b.domain}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            if (res.ok) {
                const buffer = Buffer.from(await res.arrayBuffer());
                fs.writeFileSync(`public/brand-logos/${b.name}-logo.png`, buffer);
                console.log(`  Saved ${b.name}-logo.png`);
            } else {
                console.log(`  Failed: ${res.status} ${res.statusText}`);
            }
        } catch (e) {
            console.error(`  Error:`, e);
        }
    }
}

fetchClearbit();

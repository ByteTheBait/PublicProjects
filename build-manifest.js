const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process'); 
const projectsDir = './'; 
const folders = fs.readdirSync(projectsDir);
const manifest = [];
folders.forEach(folder => {
    const projectPath = path.join(projectsDir, folder);
    if (!fs.statSync(projectPath).isDirectory()) return;
    if (['node_modules', '.git', '.vercel'].includes(folder)) return;
    const configPath = path.join(projectPath, 'config.json');
    if (fs.existsSync(configPath)) {
        try {
            const fileData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const raw = Array.isArray(fileData) ? fileData[0] : fileData;
            let url = `./${folder}/index.html`;
            console.log(`Building manifest for ${raw.TITLE}`)
            if (raw.COMMAND && raw.COMMAND !== "none"&&(raw.RUNTYPE=="npm"||raw.RUNTYPE=="react")) {
                console.log(`\n[BUILDING]: ${folder} via "${raw.COMMAND}"`);
                url=`./${folder}/dist/index.html`
                execSync(raw.COMMAND, { cwd: projectPath, stdio: 'inherit'  });

            }
            manifest.push({
                title: raw.TITLE || folder,
                summary: raw.SUMMARY || "...",
                type: raw.RUNTYPE,
                author: raw.AUTHOR,
                version: raw.VERSION,
                url: url 
            })
        } catch (err) {console.error(`[ERROR] ${folder}: ${err.message}`);}
    }
 });
fs.writeFileSync('./projects.json', JSON.stringify(manifest, null, 2));
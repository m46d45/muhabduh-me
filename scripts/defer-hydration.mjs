import fs from "node:fs";
import path from "node:path";

const loader =
  '<script data-hydrate-loader>(function(){var n=document.querySelector("script[data-hydrate]");if(!n)return;var src=n.getAttribute("data-src");if(!src)return;var done=false;function go(){if(done)return;done=true;var s=document.createElement("script");s.type="module";s.src=src;document.body.appendChild(s);}addEventListener("pointerdown",go,{once:true,passive:true});addEventListener("keydown",go,{once:true});addEventListener("touchstart",go,{once:true,passive:true});})();</script>';

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

function rewrite(html) {
  let out = html.replace(/<link rel="modulepreload"[^>]*>/g, "");
  out = out.replace(
    /<script type="module"([^>]*) src="([^"]+)"([^>]*)><\/script>/g,
    '<script data-hydrate="1" data-src="$2"></script>',
  );
  if (out.includes("data-hydrate") && !out.includes("data-hydrate-loader")) {
    out = out.replace("</body>", `${loader}</body>`);
  }
  return out;
}

const roots = [".output/public", "dist/client", ".vercel/output/static"];
let count = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    const html = fs.readFileSync(file, "utf8");
    const next = rewrite(html);
    if (next !== html) {
      fs.writeFileSync(file, next);
      count += 1;
    }
  }
}
console.log(`[defer] ${count} html files`);

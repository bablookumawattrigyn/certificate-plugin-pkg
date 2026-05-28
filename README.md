# certificate-plugin

Embeddable **certificate-module** UI and client APIs. The implementation is **vendored** from  
`certificate-module/certificate-module` (`src/vendor-certificate-module`) so behaviour and `services/api.ts` logic stay aligned with that app.

**Styling:** **Bootstrap 5** + **react-bootstrap**, **SCSS** (`src/styles/`: variables, mixins, BEM blocks), **Redux Toolkit** (`certificateStore` + UI slice), **Material Symbols** (see `index.html`). **Tailwind is removed** from the build.

Fully migrated screens include **Template list** (larger type, skeleton loading, search wired to Redux), **Page shell**, **Template builder shell**, **Design settings**, **Border configurator**, **Verification**, and **Learner certificates**. Remaining markup in **Template preview**, **Issuance config**, and some **builder panels** still uses the **old short utility class names**; those styles are covered by `src/styles/_legacy-utilities.scss` (plain SCSS, not the Tailwind compiler) until each file is rewritten with BEM + Bootstrap like the list page.

## Differences vs upstream `certificate-module`

- **No app header** from `Layout.tsx` — only the main content shell (`PageShell`: max-width container + `Outlet`). Host apps provide navigation/chrome.
- **Verification** “back” link targets `/templates` instead of `/`.

## Sync from upstream

After pulling changes in `certificate-module`, re-copy sources:

```bash
npm run sync:module
```

Then re-apply plugin-specific edits if those files were overwritten (`CertificateModuleRoutes` → `PageShell`, `VerificationPage.tsx` link). After a sync, re-check **SCSS entry** (`CertificatePlugin.jsx` → `./styles/certificate-app.scss`) and **Redux `Provider`** in `CertificatePlugin.jsx` if upstream overwrote them.

## Peer dependencies

- `react`, `react-dom`, `react-router-dom` **^7** (matches vendored module)

## Build

```bash
npm install
npm run build
```

Outputs `dist/certificate-plugin.{es,umd}.js` and `dist/certificate-plugin.css` (Bootstrap + app SCSS, no Tailwind).

## Local dev (`npm run dev`)

If the browser shows **`504 (Outdated Optimize Dep)`** for URLs under `/node_modules/.vite/deps/` (e.g. `jspdf.js`, `html2canvas.js`), Vite’s pre-bundle cache no longer matches what the page asked for—usually after a dev-server restart, dependency change, or multiple tabs.

**Fix:** stop the dev server, run `npm run dev:fresh` (runs `vite --force` to rebuild the deps cache), then **hard-refresh** the tab (Ctrl+Shift+R). Deleting `node_modules/.vite` has the same effect.

The **testing** app often avoids this because it consumes the **built** plugin and a different dependency graph; the plugin repo dev server optimizes `jspdf` / `html2canvas` directly from source imports.

## Consumer usage

```tsx
import { TemplateList, CertificateList } from '@babloo.kumawat/certificate-plugin';

<TemplateList />      {/* template library + builder */}
<CertificateList />   {/* issued certificates */}
```

Install from Trigyn GitLab npm registry (private). See [docs/PUBLISHING.md](docs/PUBLISHING.md) for maintainers and **diksha-react-web/docs/CERTIFICATE_PLUGIN.md** for host-app setup.

No CSS import, no host Vite aliases. Host apps set `GITLAB_NPM_TOKEN` once, then `npm install`.

Optional full app: `import CertificatePlugin from '@babloo.kumawat/certificate-plugin'`.

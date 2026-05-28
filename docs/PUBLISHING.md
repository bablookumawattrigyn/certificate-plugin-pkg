# Publishing @dikshatrigyn/certificate-plugin

GitLab repo: [babloo.kumawat/certificate-plugin](https://apps.trigyn.com/gitlab/babloo.kumawat/certificate-plugin)

## Tag release (recommended)

```bash
npm run build
git add package.json dist/
git commit -m "chore: release v1.0.x"
git tag v1.0.x
git push origin main v1.0.x
```

GitLab CI publishes to the project npm registry on tag push.

## Manual publish

```bash
npm run build
export GITLAB_NPM_TOKEN=your_pat
npm publish
```

Requires `.npmrc` with `@dikshatrigyn:registry` (see repo `.npmrc`).

## Consumers

See **diksha-react-web/docs/CERTIFICATE_PLUGIN.md**.

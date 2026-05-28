# Publishing to GitLab npm registry

Package name: **`@babloo.kumawat/certificate-plugin`**

Registry: Trigyn GitLab project [babloo.kumawat/certificate-plugin](https://apps.trigyn.com/gitlab/babloo.kumawat/certificate-plugin)

## First publish (one time)

1. Push this repo to GitLab.
2. Ensure **Packages** are enabled: **Settings → General → Visibility** (project must allow packages).
3. Create and push a version tag:

```bash
npm run build
git add .
git commit -m "chore: prepare v1.0.0 for registry publish"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

GitLab CI (`.gitlab-ci.yml`) builds and runs `npm publish` on tag push.

**Manual publish** (if CI is not ready):

```bash
npm run build
# Create a Personal Access Token with api + write_package_registry
export GITLAB_NPM_TOKEN=your_pat
echo "@babloo.kumawat:registry=https://apps.trigyn.com/api/v4/projects/babloo.kumawat%2Fcertificate-plugin/packages/npm/" >> .npmrc
echo "//apps.trigyn.com/api/v4/projects/babloo.kumawat%2Fcertificate-plugin/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}" >> .npmrc
npm publish
```

## Release workflow

1. Bump `version` in `package.json` (or use `npm version patch`).
2. `git push && git push --tags`
3. Consumers run `npm update @babloo.kumawat/certificate-plugin` in diksha-react-web.

## Consumer apps

See **diksha-react-web** → `docs/CERTIFICATE_PLUGIN.md` for install and Docker setup.

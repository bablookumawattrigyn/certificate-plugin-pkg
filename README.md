# @dikshatrigyn/certificate-plugin

Embeddable certificate UI for DIKSHA (`TemplateList`, `CertificateList`, builder, preview).

## Dev

```bash
npm install
npm run dev
```

## Release

```bash
npm run build
git add package.json dist/
git commit -m "chore: release v1.0.x"
git tag v1.0.x
git push origin main v1.0.x
```

Consumers (diksha-react-web):

```bash
npm update @dikshatrigyn/certificate-plugin
```

See [docs/PUBLISHING.md](docs/PUBLISHING.md) for GitLab registry details.

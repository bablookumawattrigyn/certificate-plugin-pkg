# if current version is 1.0.2

# 1. Change version in package.json (e.g. 1.0.3)
# 2. Build and commit dist
npm run build
git add package.json dist/
git commit -m "chore: release v1.0.3"
git tag v1.0.3
git push origin main v1.0.3

# 3. In diksha-react-web, update tag to #v1.0.3 and run:
npm update '@babloo.kumawat/certificate-plugin'
module.exports = {
  '*.+(js|ts)': ['eslint --cache --ext .js,.ts', 'prettier --check'],
  'package.json': [
    'npx fixpack --dryRun',
    'prettier --check --parser json-stringify'
  ],
  'package-lock.json': 'node -e "process.exit(1);"'
};

module.exports = {
  'package.json': 'npx fixpack --dryRun',
  'package-lock.json': 'node -e "process.exit(1);"'
};

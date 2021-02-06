const path = require('path');

module.exports = {
  '*.+(js|ts)'(filenames) {
    const args = filenames.map((filename) => `'${filename}'`).join(' ');

    const commands = [
      `eslint --cache --ext .js,.ts ${args}`,
      `prettier --check ${args}`
    ];

    if (filenames.some((filename) => path.extname(filename) === '.ts')) {
      commands.push('tsc --noEmit');
    }

    return commands;
  },
  'package.json': [
    'npx fixpack --dryRun',
    'prettier --check --parser json-stringify'
  ],
  'package-lock.json': 'node -e "process.exit(1);"'
};

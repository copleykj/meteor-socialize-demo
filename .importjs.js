const globals = require('globals');
module.exports = {
    declarationKeyword: 'import',
    environments: ['meteor', 'node'],
    globals: Object.keys(globals).filter(name => name !== 'meteor'),
    useRelativePaths: false
};

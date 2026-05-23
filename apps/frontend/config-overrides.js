//const rewireMobX = require('react-app-rewire-mobx');
const {
    override,
    addDecoratorsLegacy,
    fixBabelImports
} = require("customize-cra");

module.exports = override(
    addDecoratorsLegacy(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
    })
);


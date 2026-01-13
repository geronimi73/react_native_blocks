const path = require('path');

const {getDefaultConfig} = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('onnx');

// Add this:
config.watchFolders = [
	path.resolve(__dirname, '../../tensor.rn')
];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../tensor.rn/node_modules')
];

module.exports = config;
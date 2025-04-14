const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '~': path.resolve(__dirname),
};

// config.resolver.alias = {
//   '~': path.resolve(__dirname),
// };

// for DB
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, {input: './global.css'});

const { getDefaultConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '~': path.resolve(__dirname),
  '@rn-primitives/portal': path.resolve(
    __dirname,
    'components/primitives/portal',
  ),
};

// for DB
config.resolver.sourceExts.push('sql');

config.resolver.assetExts.push('mp3');

module.exports = withNativeWind(config, { input: './global.css' });

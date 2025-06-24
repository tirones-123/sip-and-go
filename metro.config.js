const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude native-only modules from web builds
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

// Web-specific resolver configuration
config.resolver.resolverMainFields = ['browser', 'main'];

// Exclude problematic native modules from web builds
config.resolver.blockList = [
  // Exclude Superwall from web builds
  /node_modules\/@superwall\/react-native-superwall\/.*/,
  // Exclude RevenueCat from web builds  
  /node_modules\/react-native-purchases\/.*/,
];

// Simpler transformer configuration
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

// Web-specific serializer
config.serializer = {
  ...config.serializer,
  getModulesRunBeforeMainModule: () => [],
};

module.exports = config; 
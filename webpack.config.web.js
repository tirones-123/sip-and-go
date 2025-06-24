const { getDefaultConfig } = require('expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await getDefaultConfig(env, argv);
  
  // Simplified fallback configuration
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": false,
    "stream": false,
    "assert": false,
    "http": false,
    "https": false,
    "os": false,
    "url": false,
    "zlib": false,
  };

  return config;
}; 
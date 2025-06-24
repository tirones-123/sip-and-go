const { getDefaultConfig } = require('expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await getDefaultConfig(env, argv);
  
  // Fix import.meta issues
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

  // Define import.meta polyfill
  config.plugins = config.plugins || [];
  config.plugins.push(
    new (require('webpack')).DefinePlugin({
      'import.meta': {
        env: JSON.stringify(process.env),
        url: 'new URL(document.currentScript.src).href',
      },
    })
  );

  // Add polyfills for import.meta
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Ensure proper module format
  config.output = {
    ...config.output,
    chunkFormat: 'array-push',
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false,
    },
  };

  return config;
}; 
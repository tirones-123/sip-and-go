const { transform } = require('@babel/core');

module.exports = {
  transform: ({ src, filename, options }) => {
    // For web platform, transform import.meta
    if (options.platform === 'web') {
      // Transform import.meta to a safe object
      const transformedSrc = src.replace(
        /import\.meta/g, 
        '(typeof window !== "undefined" ? {env: process.env} : {})'
      );
      
      // Use Babel to transform the code
      const result = transform(transformedSrc, {
        filename,
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-proposal-class-properties',
        ],
      });
      
      return {
        code: result.code,
        map: result.map,
      };
    }
    
    // For other platforms, use Babel with default settings
    const result = transform(src, {
      filename,
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    });
    
    return {
      code: result.code,
      map: result.map,
    };
  },
}; 
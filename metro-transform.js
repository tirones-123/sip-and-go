const upstreamTransformer = require('metro-react-native-babel-transformer');

module.exports.transform = function({ src, filename, options }) {
  // Transform import.meta to safe values for web
  if (options.platform === 'web' && src.includes('import.meta')) {
    src = src.replace(/import\.meta\.env/g, 'process.env');
    src = src.replace(/import\.meta/g, '{ url: "" }');
  }
  
  return upstreamTransformer.transform({ src, filename, options });
}; 
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@src': './src',
            '@alerts': './src/alerts',
            '@components': './src/components',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@pages': './src/pages',
            '@providers': './src/providers',
            '@services': './src/services',
            '@styles': './src/styles',
            '@utils': './src/utils',
            '@type': './src/types',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
    ],
  };
};

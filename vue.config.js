module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    let vueLoaderOptions = {};

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        vueLoaderOptions = options;
        return options;
      });

    const rule = config.module.rule('markdown').test(/\.md$/);

    rule
      .use('vue-loader')
      .loader('vue-loader')
      .options(vueLoaderOptions);
    rule
      .use('mark-loader')
      .loader(require.resolve('@vuepress/markdown-loader'))
      .options({
        sourceDir: '' /* root source directory of your docs */,
      });
  },
};

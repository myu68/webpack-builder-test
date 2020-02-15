
const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniExtractPlugin = require('mini-css-extract-plugin');

const projectRoot = process.cwd(); // 打包时引用同级目录的文件

// 多页面应用打包通用方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    return htmlWebpackPlugins.push(
      // 压缩 html
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', 'commons', pageName],
        inject: true, // 打包后的 js css 会自动注入到 filename 文件中
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();
console.log(entry); // eslint-disable-line
module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader',
        // use: 'eslint-loader'
      },
      {
        test: /.css$/,
        // 执行顺序 从右到左 链式调用
        use: [
          MiniExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /.less$/,
        use: [
          MiniExtractPlugin.loader,
          'css-loader',
          'less-loader',
          // css 浏览器前缀自动补全插件
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browers: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          // 把 px 转换为 rem
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecesion: 8, // 转换为 rem 后保存的小数位数
            },
          },
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif)$/,
        // use: 'file-loader'
        use: [{
          loader: 'file-loader',
          options: {
            // limit: 10240
            name: '[name]_[hash:8].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    // 提取打包 css
    new MiniExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    // 错误捕获
    new FriendlyErrorsWebpackPlugin(),
    function errorsPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length) {
          console.log('build error'); // eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only',
};

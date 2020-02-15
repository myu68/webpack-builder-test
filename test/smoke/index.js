const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '100000ms',
});

process.chdir(path.join(__dirname, 'template')); // 进入到 template 目录

// console.log(`cwd: ${process.cwd()}`);
// console.log('./: ', path.resolve('./lib/webpack.base.js'));

rimraf('./dist', () => {
  const prodConfig = path.resolve('./lib/webpack.base.js');
  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.log(err);
      process.exit(2);
    }
    console.log(stats.toString());
    // {
    //   colors: true,
    //   modules: false,
    //   children: false,
    // }
    // mocha 测试 是否成功生成 html js css 文件
    console.log('webpack build success, begin run test.');

    mocha.addFile(path.join(__dirname, 'html-test.js'));
    mocha.addFile(path.join(__dirname, 'css-js-test.js'));

    mocha.run();
  });
});

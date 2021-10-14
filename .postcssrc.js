// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {  },
    // "postcss-px2rem-exclude": {  // 添加的代码
    //   remUnit: 75,
    //   rootValue: 75,
    //   exclude: /node_modules|folder_name/i // 忽略node_modules目录下的文件
    // }
  }
  // plugins: {
  //   'autoprefixer': {
  //     browsers: ['Android >= 4.0', 'iOS >= 7']
  //   },
  //   'postcss-pxtorem': {
  //     rootValue: 16,//结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
  //     propList: ['*']
  //   }
  // }
}

'use strict'
const utils = require('./utils')
const config = require('../config')
// const px2rem = require('postcss-px2rem')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  // postcss: function () {
  //   //UI图片的基准值 750px就是75,640px就是64,默认为75       
  //   return [px2rem({ remUnit: 75, remPrecision: 6, baseDpr: 2, })];
  //   //准换成rem后的小数点精确数位 默认为6      
  //   //基准device pixel ratio值 默认为2          
  // },
}

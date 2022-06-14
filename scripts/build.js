const vitpress = require('vitepress')
const path = require('path')
const chalk = require('chalk')

/** 构建说明：
 *
 *  所有需要的构建步骤，都应封装为返回 Promise 的函数
 *  保证不会因为任何异步操作导致构建错误或失败
 * （若有顺序必要，则依次调用）
 */

const rewriteTitle = require('../.vitepress/rewrite-title')

rewriteTitle().then(() => {})

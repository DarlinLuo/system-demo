const merge = require('webpack-merge')
const path = require('path')

const webpack = require('webpack')

const configPage = require('./src/config/index')

module.exports = {
  // Type: string  部署应用时的基本 URL
  // baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? '././' : './',

  // Type: string  放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',

  // Type: string  指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
  indexPath: 'index.html',

  // Type: boolean  默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希
  filenameHashing: true,

  // Type: boolean | 'error' 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。 设置为 true 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
  // lintOnSave: 'error',
  lintOnSave: false,

  // Type: Array<string | RegExp> 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  // transpileDependencies: [],

  // Type: boolean  如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,

  // Type: string  设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响
  // crossorigin: undefined,

  // Type: boolean  在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性
  integrity: false,

  pluginOptions: {
    dll: {
      // 入口配置
      entry: ['vue', 'vuex', 'vue-router', 'axios', './src/plugins/dll.js'],
      // entry: ['vue', 'vuex', 'vue-router', 'axios', 'element-ui', 'localforage', 'lodash', 'dateformat', './src/plugins/draggable.js', 'uuid', 'vue-quill-editor', 'vue-clipboard2', 'vue-introjs', 'vue-awesome-swiper'],
      // 输入目录
      output: path.join(__dirname, './public/dll'),

      // 是否开启 DllReferencePlugin,

      // 1. 如果你需要在开发环境中不采用开启分包模式，你可以配置open为false。
      // 例如，我们入口配置为 entry: ['vue']， 我们执行npm run dll 构建了vendor包。
      // 在npm run serve的时候，如果默认open开启的情况下，其实开发环境采用的vue是生产环境的包，因为我们dll命令构建的就是生产环境的包。
      // 这会让我们在开发环境中无法看到vue给我们带来的友好提示建议。
      // 我们可以配置open : process.env.NODE_ENV === 'production'，只在生产环境开启DllReferencePlugin

      // 2. 参数会自动识别是否有先执行npm run dll生产分包，如果没有的情况下则不开启dll。
      open: true,

      // 自动注入到index.html
      // 在构建其他命令的时候，如果开启了自动注入。程序会手动将output中生成的*.dll.js 文件自动注入到index.html中。
      inject: true
    }
  },

  // Type: Object | Function  https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  // configureWebpack

  // Type: Function  https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7  是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    // 小图片转base64
    config.module.rule('images').test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/).use('url-loader').loader('url-loader').tap(options => merge(options, { limit: 1000, name: path.posix.join(process.env.NODE_ENV === 'production' ? 'static' : 'static', 'img/[name].[hash:7].[ext]') })).end()

    config.plugin('provide').use(webpack.ProvidePlugin, [{ introJs: ['intro.js', 'introJs'] }])
  },

  css: {
    // Type: boolean | Object  Default: 生产环境下是 true，开发环境下是 false  是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    // extract: process.env.NODE_ENV === 'production' ? false : false,
    extract: false,

    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。
    sourceMap: false,

    loaderOptions: {
      css: {
      },
      postcss: {
      },
      sass: {
        // 所以这个假设你有 `src/variables.scss`
        // data: `@import "@/variables.scss";`
      },
      less: {
      }
    }
  },

  // Type: Object  https://webpack.js.org/configuration/dev-server/  所有 webpack-dev-server 的选项都支持。注意：有些值像 host、port 和 https 可能会被命令行参数覆写。有些值像 publicPath 和 historyApiFallback 不应该被修改，因为它们需要和开发服务器的 baseUrl 同步以保障正常的工作
  devServer: {
    port: 9777,
    proxy: {
      // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。这个问题可以通过 vue.config.js 中的 devServer.proxy 选项来配置
      '/api': {
        // 代理地址
        target: configPage.developApi,
        // 如果是https接口，需要配置这个参数
        secure: false,
        ws: true,
        // 可否跨域
        changeOrigin: true,
        pathRewrite: {
          // 重写接口，去掉/api
          '^/api': '/'
        }
      }
    }
  }
}

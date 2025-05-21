1. 删除webpack、vue-cli 相关依赖（babel-loader、sass-loader等）
2. 删除babel配置文件（babel.config.js）
3. 将 /public/index.html 移动到根目录，调整src，删除%xxx%变量，添加

   ```
     <script type="module" src="/src/main.js"></script>
   ```
4. 安装依赖

   ```
   pnpm add (-D) 
   vite
   sass (less)
   @vitejs/plugin-vue2
   @vitejs/plugin-vue2-jsx

   ```
5. 添加vite.config.js

   ```
   import { defineConfig, loadEnv } from 'vite'
   import vue from '@vitejs/plugin-vue2'
   import vueJsx from '@vitejs/plugin-vue2-jsx'
   import { resolve } from 'path'
   // import Components from 'unplugin-vue-components/vite'
   // import { ElementUiResolver } from 'unplugin-vue-components/resolvers'
   // import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
   import requireTransform from 'vite-plugin-require-transform'
   // import commonjs from 'vite-plugin-commonjs'

   // https://vitejs.dev/config/
   export default defineConfig(({ command, mode }) => {
     const { VITE_APP_NAME, VITE_APP_PORT } = loadEnv(mode, process.cwd()) // 加载环境变量
     console.log('当前模式', mode)

     return {
       base: VITE_APP_NAME,
       server: {
         host: true,
         port: VITE_APP_PORT,
         proxy: {
           // '/api': {
           //   target: 'http://192.168.1.1',
           //   changeOrigin: true
           // },
         }
       },
       plugins: [
         vue(),
         vueJsx(),
         // commonjs({
         //   filter(id) {
         //     // 默认会排除 `node_modules`，所以必须显式的包含它explicitly
         //     // https://github.com/vite-plugin/vite-plugin-commonjs/blob/v0.7.0/src/index.ts#L125-L127
         //     // if (id.includes('xxx')) {
         //     //   return true
         //     // }
         //   }
         // }),
         // 解决部分require引入问题
         requireTransform({
           fileRegex: /.vue$|.png$/
         })

         // createSvgIconsPlugin({
         //   iconDirs: [resolve(__dirname, 'src/assets/svg')],
         //   symbolId: 'icon-[dir]-[name]'
         // }),
         // Components({
         //   dirs: ['src/components/globalComp']
         //   // resolvers: [
         //   //   ElementUiResolver({
         //   //     // importStyle: false
         //   //   })
         //   // ]
         // })
       ],
       resolve: {
         alias: {
           '@': resolve(__dirname, 'src'),
           src: resolve(__dirname, '../src'),
           static: resolve(__dirname, '../static'),
           api: resolve(__dirname, '../src/api'),
           vue: 'vue/dist/vue.esm.js' // 缺少此项el-table渲染将有问题
         },
         extensions: ['.js', '.jsx', '.json', '.png', '.vue']
       },
       css: {
         preprocessorOptions: {
           scss: {
             // modifyVars: generateThemeVars(mode),
             // additionalData: `@import "./src/styles/index.scss";`,
             javascriptEnabled: true,
             sassOptions: { outputStyle: 'expanded' }
           }
         }
       },
       esbuild: {
         loader: 'jsx',
         include: /src\/.*\.jsx?$/,
         exclude: []
       },
       define: {
         'process.env': process.env
       },
       build: {
         rollupOptions: {
           // https://rollupjs.org/configuration-options/
           output: {
             dir: 'iot-admin-web',
             manualChunks: {
               avue: ['@smallwei/avue'],
               'element-ui': ['element-ui']
             }
           }
         },
         commonjsOptions: {
           transformMixedEsModules: true // 支持混合导入
         }
       }
       // optimizeDeps: {
       //   include: ['element-ui'] // 预构建 element-ui
       // }
     }
   })


   ```
6. 修改环境变量（VUE_APP_XXX  -->   VITE_APP_XXX）
7. 调整 package.json scripts

   ```
     "scripts": {
       "dev": "vite --mode development",
       "build:dev": "vite build --mode test",
       "build:prod": "vite build --mode production"
     },
   ```
8. 注意 sass 版本，高版本启动时会在控制台打印很多警告
9. 解决 require 导入问题（改 import 或使用 vite-plugin-require-transform）
10. 使用 wujie 加载导致样式丢失问题（跟高版本 Vite 相关），[Github issue 解决](https://github.com/Tencent/wujie/issues/434)
11. 使用 vite 打包导致 ElementUI 的 table 组件显示空白，[Github issue 解决](https://github.com/ElemeFE/element/issues/21968)
12. vite@4和vite@5在wujie作为子应用时对 newURL(`../assets/${path}`, import.meta.url).href 的处理不一样，后者不需要作兼容处理，前者需要，举例如下：

    ```
    export function getImgUrl(path) {
      // if (window?.__POWERED_BY_WUJIE__ && import.meta.env.DEV) {
      //   const basePath = window?.__WUJIE_PUBLIC_PATH__ || "/";
      //   return `${basePath}iot-admin-web/src/assets/${path}`;
      // }
      return new URL(`../assets/${path}`, import.meta.url).href;
    }
    ```
13. vite 对scss进行import会报错，需要添加?inline

    ```
    如：import variables from "@/styles/variables.scss?inline";
    这个错误发生的原因是：

    1. Vite默认会将.scss文件视为CSS模块处理，而不是像Vue CLI那样处理 :export 指令
    2. 添加 ?inline 查询参数可以让Vite以内联方式处理该文件，保留 :export 指令的功能
    ```
14. 

其他参考链接：[vue2 迁移到vite](https://juejin.cn/post/7265524106816700479#heading-1)、[从 Vue-cli 迁移到 vite 的记录](https://carljin.com/posts/migrating-from-webpack-vue-cli-to-vitejs/)

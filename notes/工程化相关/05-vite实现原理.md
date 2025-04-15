### vite 的实现原理

#### 1. 它是基于浏览器的 type 为 module 的 script 可以直接下载 es module 模块实现的。

#### 2. 做了一个开发服务，根据请求的 url 来对模块做编译，调用 vite 插件来做不同模块的 transform。

#### 3. 但是 node_modules 下的文件有的包是 commonjs 的，并且可能有很多个模块，这时 vite 做了预构建也叫 deps optimize（依赖优化）。它用 esbuild 分析依赖，然后用 esbuild 打包成 esm 的包之后输出到 node_modules/.vite 下，并生成了一个 metadata.json 来记录 hash。

#### 4. 浏览器里用 max-age 强缓存这些预打包的模块，但是带了 hash 的query。这样当重新 build 的时候，可以通过修改 query 来触发更新。

#### 5. 在开发时通过 connect 起了一个服务器，调用 vite 插件来做 transform，并且对 node_modules 下的模块做了预构建，用 esbuild 打包。

#### 6. 在生产环境用 rollup 来打包，因为 vite 插件兼容了 rollup 插件，所以也是用同样的插件来处理，这样能保证开发和生产环境代码一致。

#### 7. 此外，vite 还基于 chokidar 和 websocket 来实现了模块热更新。

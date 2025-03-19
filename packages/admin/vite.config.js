import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import {viteMockServe} from "vite-plugin-mock";
import { viteStaticCopy } from 'vite-plugin-static-copy'
console.log('viteStaticCopy')
console.log(viteStaticCopy)
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV,VITE_APP_USE_MOCK } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
        createVitePlugins(env, command === 'build'),
        viteMockServe({
          mockPath: 'mock',// mock 数据文件所在的目录
          localEnabled: true, // 是否启用本地 mock 数据  VITE_APP_USE_MOCK
          prodEnabled: false, // 生产环境是否启用 mock
        }),
        viteStaticCopy({
            targets: [
                {
                    src: "../static/Editor/tinymce/*",  
                    dest: './',  
                },
            ],
        }), 
    ],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    /* 用途是将我们的constant.scss中的scss常量加载到全局，这样我们可以在style标签中，随意使用这些scss常量 */
    build: {
        rollupOptions:{
            output: {
                entryFileNames: 'js/[name].js',//入口文件
                // entryFileNames: 'js/[name]-[hash].js',//入口文件
                chunkFileNames: 'js/[name].js',//分包引入文件
                // chunkFileNames: 'js/[name]-[hash].js',//分包引入文件
                // assetFileNames: '[ext]/[name]-[hash].[ext]',//静态文件
                assetFileNames(assetInfo){
                    console.log(assetInfo)
                    //文件名称
                    if (assetInfo.name.endsWith('.css')) {
                        return 'css/[name].css'
                        // return 'css/[name]-[hash].css'
                    }
                    //图片名称
                    //定义图片后缀
                    const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg','.ico']
                    if(imgExts.some(ext => assetInfo.name.endsWith(ext))){
                        return 'imgs/[name].[ext]'
                        // return 'imgs/[name]-[hash].[ext]'
                    }
                    //剩余资源文件
                    return 'assets/[name].[ext]'
                    // return 'assets/[name]-[hash].[ext]'
                }
            }, 
            external: ['/static/Editor/tinymce/tinymce.min.js','/static/Editor/tinymce/tinymce.js','/tinymce.js'] 
          //   external: ['/static/Editor/tinymce/tinymce.min.js'],
        },  
        
    },
    // vite 相关配置
    server: {
      port:env.VITE_APP_PORT,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        }
      }
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  }
})

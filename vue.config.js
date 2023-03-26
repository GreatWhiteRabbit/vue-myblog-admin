module.exports = {
    devServer: {
        proxy: {
            "/apis": {
                 target: "http://127.0.0.1:8081/", // 需要请求的地址
              //  target: process.env.VUE_APP_API_URL, // 需要请求的地址
                changeOrigin: true, // 是否跨域
                ws:true,
                pathRewrite: {
                    "^/apis": "" // 替换target中的请求地址，也就是说，在请求的时候，url用'/proxy'代替'http://ip.taobao.com'
                }
            }
        }
    },
    productionSourceMap: false,

}
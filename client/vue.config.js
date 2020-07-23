const webpack = require('webpack')
const proxy = require('http-proxy-middleware')

module.exports = {
    outputDir: '../server/dist/public',
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        ]
    },
    devServer: {
        proxy: 'http://localhost:3000'
    }
}

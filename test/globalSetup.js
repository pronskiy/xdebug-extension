const http = require('http');

module.exports = async function (globalConfig, projectConfig) {
    if (projectConfig.globals.config.examplePage !== 'http://localhost:8765') {
        return;
    }

    global.server = http.createServer(function (req, res) {
        res.write('Xdebug extension test page');
        res.end();
    }).listen(8765);
}
module.exports = async function (globalConfig, projectConfig) {
    if (global.server) {
        global.server.close();
    }
}
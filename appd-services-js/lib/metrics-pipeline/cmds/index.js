
const cmds = {};
require('fs').readdirSync(__dirname).forEach(cmdFile => {
    const [file, cmd] = /^(.*)\.js$/.exec(cmdFile);
    if (file !== 'index.js' && !/^_.*/.test(file)) {
        cmds[cmd] = require(`./${file}`);
        cmds[cmd].named = cmd;
    }
});
module.exports = cmds;

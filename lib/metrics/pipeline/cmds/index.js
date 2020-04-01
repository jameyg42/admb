
const cmds = {};
require("fs").readdirSync(__dirname).forEach(cmdFile => {
    const [file, cmd] = /^(.*)\.js$/.exec(cmdFile);
    if (file !== 'index.js') {
        cmds[cmd] = require(`./${file}`);
    }
});
module.exports = cmds;

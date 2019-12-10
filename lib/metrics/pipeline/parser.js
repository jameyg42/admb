const op = '|>';

const cmdMap = require('./cmds');

function parse(expr, ctx, pos) {
    pos = pos || 0;
    const parts = expr.split(op);
    const cmds = [];

    for (let p of parts) {
        let elen = p.length;
        p = p.trim();

        if (cmds.length == 0 && !/^search/.test(p)) { // fixme - search is default command for first part
            p = `search ${p}`;
        }
        const exp = /^(\S+)\s*(.*)$/g.exec(p);
        const cmd = exp[1];
        const args = exp[2] || '';

        if (!cmdMap[cmd]) {
            throw `invalid command '${cmd}' @ ${pos}`
        }
        cmds.push(cmdMap[cmd].parse(ctx, args));
        pos += elen;
    }
    return cmds;
}

module.exports = parse;
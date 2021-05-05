const tmpl = require('../lib/tmpl');

const model = {
    name: {
        first: 'james',
        last: 'graham',
    },
    age: 45,
    mentalAge: 13,
    addr: {
        street: {
            addr1: '418 champion cir',
            city: 'throop',
            state: 'pa',
            zip: '18512'
        }
    },
    nicknames: ['jamey', 'jay', 'gramby'],
    

};

console.log(tmpl.eval('hello #{name.first} #{name.last}', model));
console.log(tmpl.eval("you're #age years old but act like a #{mentalAge} year old", model));

console.log(tmpl.with(model).eval('you live at #{addr.street.addr1} but have mail delivered to #{addr.mail.addr1}'));
console.log(tmpl.eval('also known as #nicknames', model));

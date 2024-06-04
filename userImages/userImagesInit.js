const fs = require('fs');

let userMap = new Map();

const data = JSON.stringify(Object.fromEntries(userMap));
fs.writeFileSync('saveState.json', data, 'utf8');

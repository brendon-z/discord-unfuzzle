const fs = require('fs');

let userImageMap = new Map();

const data = JSON.stringify(Object.fromEntries(userImageMap));
fs.writeFileSync('saveState.json', data, 'utf8');

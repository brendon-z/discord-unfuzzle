const user = require('../commands/user');

require('dotenv').config();
const R6API = require('r6api.js').default;

const { UBI_EMAIL: email = '', UBI_PASSWORD: password = '' } = process.env;
const r6api = new R6API({ email, password });

async function validPlayer(username) {
  return !(await r6api.validateUsername(username)).valid;
}

async function playerStats(platform, username) {
  const { 0: player } = await r6api.findByUsername(platform, username);
  if (!player) return 'Player not found';

  const { 0: stats } = await r6api.getStats(platform, player.id);

  return stats;
};

async function playerDetails(platform, username) {
  const { 0: player } = await r6api.findByUsername(platform, username);
  if (!player) return 'Player not found';

  return player;
};


module.exports = { playerStats, playerDetails, validPlayer}
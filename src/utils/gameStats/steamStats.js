import api from 'steam-js-api';

const { STEAM_APIKEY: apiKey = ''} = process.env;
api.setKey(apiKey);

async function getRecentGames(steamId) {
  try {
    result = await api.getRecentlyPlayedGames(steamId, 0);
    return result.data;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

async function getSteamDetails(steamId) {
  try {
    result = await api.getPlayerSummaries(steamId);
    return result.data.players[steamId];
  } catch (error) {
    console.error(error);
    return error;
  }
}

export { getRecentGames, getSteamDetails }

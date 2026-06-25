const axios = require('axios');

/**
 * Fetch game details from Steam Storefront API using a Steam App ID.
 * Returns: { title, description, price, releaseDate, tags, headerImage, screenshots }
 */
async function fetchSteamGameData(steamAppId) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=us&l=en`;
  const { data } = await axios.get(url, { timeout: 8000 });

  const appData = data[steamAppId];
  if (!appData?.success) throw new Error('Steam App ID not found or data unavailable');

  const d = appData.data;
  return {
    title:         d.name,
    description:   d.short_description,
    price:         d.is_free ? 0 : (d.price_overview?.final || 0) / 100,
    releaseDate:   d.release_date?.date ? new Date(d.release_date.date) : null,
    tags:          d.genres?.map(g => g.description) || [],
    headerImage:   d.header_image || '',
    screenshots:   d.screenshots?.slice(0, 6).map(s => s.path_full) || [],
    storeLink:     `https://store.steampowered.com/app/${steamAppId}`
  };
}

/**
 * Fallback: fetch from RAWG.io API using game title search.
 */
async function fetchRawgGameData(gameName) {
  const key = process.env.RAWG_API_KEY;
  const url = `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(gameName)}&page_size=1`;
  const { data } = await axios.get(url, { timeout: 8000 });

  const game = data.results?.[0];
  if (!game) throw new Error('Game not found on RAWG');

  return {
    title:       game.name,
    description: game.description_raw || '',
    releaseDate: game.released ? new Date(game.released) : null,
    tags:        game.genres?.map(g => g.name) || [],
    headerImage: game.background_image || '',
    rating:      game.rating || 0
  };
}

module.exports = { fetchSteamGameData, fetchRawgGameData };

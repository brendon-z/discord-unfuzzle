const fs = require('fs');

// Add a userId - imageUrl pair to the map data structure
function addToMap(userId, imageUrl) {
  let userImageMap = loadPersist();
  userImageMap.set(userId, imageUrl);
  savePersist(userImageMap);
}

// Get an imageUrl from an input userId
function getImageUrl(userId) {
  let userImageMap = loadPersist();
  return userImageMap.get(userId);
}

// Function which loads persistence save file
function loadPersist() {
  if (fs.existsSync('saveState.json')) {
    const data = fs.readFileSync('saveState.json').toString();
    let userImageMap = new Map(Object.entries(JSON.parse(data)));
    
    return userImageMap;
  } else {
    console.log('No saveState.json found!')
  }
}

// Function which saves persistence
function savePersist(userImageMap) {
  // Overwrite any existing file
  if (fs.existsSync('saveState.json')) {
    fs.unlinkSync('saveState.json');
  }
  const data = JSON.stringify(Object.fromEntries(userImageMap));
  fs.writeFileSync('saveState.json', data, 'utf8');
}

// Checks whether an image url is associated with key userId
function hasImageUrl(userId) {
  let userImageMap = loadPersist();
  return userImageMap.has(userId);
}

module.exports = { addToMap, getImageUrl, hasImageUrl };
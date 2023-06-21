import { createUserEntry, savePersist, loadPersist } from '../../database/dbManage.js';

// Add a userId - imageUrl pair to the map data structure
function addToMap(userId, imageUrl) {
	let userMap = loadPersist();
	let user = userMap.get(userId)
	
	if (user == null) {
		user = createUserEntry(userId)
	}
	user.imageUrl = imageUrl
	userMap.set(userId, user);
	savePersist(userMap);
}

// Get an imageUrl from an input userId
function getImageUrl(userId) {
	let userMap = loadPersist();
	user = userMap.get(userId)
	if (user == null) {
		return null;
	}
	return userMap.get(userId).imageUrl;
}

// Checks whether an image url is associated with key userId
function hasImageUrl(userId) {
	let userMap = loadPersist();
	return userMap.has(userId);
}

export { addToMap, getImageUrl, hasImageUrl };
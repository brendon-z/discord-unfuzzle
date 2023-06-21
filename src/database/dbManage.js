import fs from 'fs';

function createUserEntry(userId) {
    const newUser = {
        userId: userId,
        imageUrl: "",
        calLink: ""
    }

    return newUser
}

// Function which saves persistence
function savePersist(userMap) {
  	// Overwrite any existing file
  	if (fs.existsSync('saveState.json')) {
    	fs.unlinkSync('saveState.json');
  	}
  	const data = JSON.stringify(Object.fromEntries(userMap));
  	fs.writeFileSync('saveState.json', data, 'utf8');
}

// Function which loads persistence save file
function loadPersist() {
  	if (fs.existsSync('saveState.json')) {
    	const data = fs.readFileSync('saveState.json').toString();
    	let userMap = new Map(Object.entries(JSON.parse(data)));
    
    	return userMap;
  	} else {
    	console.log('No saveState.json found!')
  	}
}

function userCalendarExists(userId) {
	data = loadPersist();
	if (data.get(userId) === undefined || data.get(userId).calLink === "") {
		return false;
	}
	return true;
}

export { createUserEntry, savePersist, loadPersist, userCalendarExists };
const prompt = require('prompt-sync')();
const scraelmbr = require('scraelmbr');

console.log('Input desired strings, separate separate strings with @');
const inputString = prompt('=> ');
const option = prompt('Do you want to scramble the words in a readable manner? y OR n? ')

const outputArray = stringUnjumble(inputString, option);
console.log(outputArray);

function stringUnjumble(inputString, option) {

    // Stores a database of "unjumbled" strings cause yes :)
    let stringDb = inputString.split('@');
    console.log(stringDb);
    
    // Fix up each string by swapping first and last letter
    for (let i = 0; i < stringDb.length; i++) {
        let wordArray = stringDb[i].split(' ');
        
        // Swap first and last letter and put it back into the stringDb
        for (let j = 0; j < wordArray.length; j++) {
            let letterArray = wordArray[j].split('');
            swapLetters(letterArray);
            wordArray[j] = letterArray.join('');
        }

        stringDb[i] = wordArray.join(' ');

        // Apply scraemblr cause lol
        if (option === 'y') {
            stringDb[i] = scraelmbr(stringDb[i]);
        }
    }

    return stringDb;
}

function swapLetters(inputWord) {
    const temp = inputWord[0];
    inputWord[0] = inputWord[inputWord.length - 1];
    inputWord[inputWord.length - 1] = temp;
    
    return inputWord;
}
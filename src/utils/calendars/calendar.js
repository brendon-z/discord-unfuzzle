import ical from 'node-ical';
import moment from 'moment-timezone';
import http from 'http'; // or 'https' for HTTPS URLs
import { DownloaderHelper } from 'node-downloader-helper';

import { createUserEntry, savePersist, loadPersist, userCalendarExists } from '../../database/dbManage.js';
import config from '../../../config.json' assert { type: "json" }

function addCalendar(userId, calLink) {
    let userMap = loadPersist();
    let user = userMap.get(userId)

    if (!calLink.includes("http:")) return;
    const dl = new DownloaderHelper(calLink, 'calendars/calFiles');

    dl.on('end', () => console.log('Download Completed'));
    dl.on('error', (err) => console.log('Download Failed', err));
    dl.start().catch(err => console.error(err));    

    if (user == null) {
      user = createUserEntry(userId)
    }
    user.calLink = calLink
    userMap.set(userId, user);
    savePersist(userMap);
}

function getCalendar(userId) {
    let userMap = loadPersist();
    user = userMap.get(userId)
    if (user == null) {
      return null;
    }
    return userMap.get(userId).calLink;
}

async function checkClasses(target, date) {
    let atUni = new Map();
    const promises = [];
    const data = loadPersist();
    
    if (target === 'everyone') {
        for (let [userId, user] of data) {
            promises.push(
                parseCalendar(user.calLink, date)
                    .then(todaysClasses => {
                        if (todaysClasses.length > 0) {
                            atUni.set(userId, todaysClasses);
                        }
                    })
                    .catch(error => {
                        console.log('Error parsing calendar:', error);
                    })
            );
        }
    } else {
        atUni.set(target, await parseCalendar(data.get(target).calLink, date));
    }
    await Promise.all(promises);
    return atUni;
}

async function parseCalendar(link, date) {
    let currDate;
    if (date === "today") {
        currDate = moment().tz('Australia/Sydney');
    } else {
        currDate = moment(date);
        if (!currDate.isValid()) {
            currDate = moment().tz('Australia/Sydney');
        }
    }
    let todaysClasses = []
    const data = ical.sync.parseFile('calendars/calFiles/' + link.replace('http://my.unsw.edu.au/cal/pttd/',''))
    for (let k in data) {
        if (!Object.prototype.hasOwnProperty.call(data, k)) continue;

        const event = data[k];
        if (event.type !== 'VEVENT' || !event.rrule) continue;
        
        const dates = event.rrule.between(new Date(config.currentYear, 0, 1, 0, 0, 0, 0), new Date(config.currentYear, 11, 31, 0, 0, 0, 0))

        if (dates.length === 0) continue;

        dates.forEach(date => {
            let newDate
            if (event.rrule.origOptions.tzid) {
                // tzid present (calculate offset from recurrence start)
                const dateTimezone = moment.tz.zone('UTC')
                const localTimezone = moment.tz.guess()
                const tz = event.rrule.origOptions.tzid === localTimezone ? event.rrule.origOptions.tzid : localTimezone
                const timezone = moment.tz.zone(tz)
                const offset = timezone.utcOffset(date) - dateTimezone.utcOffset(date)
                newDate = moment(date).add(offset, 'minutes').toDate()
            } else {
                // tzid not present (calculate offset from original start)
                newDate = new Date(date.setHours(date.getHours() - ((event.start.getTimezoneOffset() - date.getTimezoneOffset()) / 60)))
            }
            const start = moment(newDate)
            if (currDate.isSame(start, 'date') && event.location !== 'Online') {
                // console.log('Recurrence start:', start, " today? " + currDate.isSame(start, 'date'));
                todaysClasses.push({className: event.summary, time: start.add(dstOffset(), 'hours'), location: event.location})
            }
        });
        }
    return todaysClasses;
}

async function constructEmbed(client, target = 'everyone', date = 'today') {
    let onCampusEmbed;
    let day = moment().format('dddd')

    if (userCalendarExists(target) || target === 'everyone') {
        let currTime = moment();
        if (date === 'today') {
            day = moment().format('dddd');
            date = moment().format('YYYY-MM-DD');
        } else if (date === 'tomorrow') {
            day = moment().add(1, 'days').format('dddd');
            date = moment().add(1, 'days').format('YYYY-MM-DD');
        } else if (date === 'yesterday') {
            day = moment().add(-1, 'days').format('dddd');
            date = moment().add(-1, 'days').format('YYYY-MM-DD');
        } else {
            if (moment(date).isValid()) {
                day = moment(date, 'YYYY-MM-DD').format('dddd');;
            } else {
                day = moment().format('dddd');
                date = moment().format('YYYY-MM-DD');
            }
        }

        if (day !== "Saturday" && day !== "Sunday") {
            let atUni = await checkClasses(target, date);
            let userMap = loadPersist();
            onCampusEmbed = {
                color: 0x8300FF,
                title: `On campus: ${day}`,
                fields: [],
                footer: {
                    text: 'Please note there is no guarantee these people actually attend their classes',
                    icon_url: 'https://static.wikia.nocookie.net/logopedia/images/8/88/Cadbury_Flake_2021.png/revision/latest/scale-to-width-down/1000?cb=20210324190956',
                },
            }
    
            // List classes by name

            // for (let [user, classes] of atUni) {
            //     let classStr = ""
            //     let indicator = false
            //     for (let c of classes.sort(timeSort)) {
            //         if (c.time.isBefore(currTime) && indicator === false) {
            //             classStr += c.time.format('h:mm a') + ': ' + c.className + ' at ' + c.location + '\n'; // change later
            //             indicator = true
            //         } else {
            //             classStr += c.time.format('h:mm a') + ': ' + c.className + ' at ' + c.location + '\n';
            //         }
            //     }
            //     let userField = {name: (await client.users.fetch(user)).username, value: classStr}
            //     onCampusEmbed.fields.push(userField);
            // }

            // List classes by time

            let times = new Map();

            for (let [user, classes] of atUni) {
                for (let c of classes) {
                    let realName = (await client.users.fetch(user)).username
                    if (userMap.has(user) && userMap.get(user).realName != "") {
                        realName = userMap.get(user).realName;
                    }
                    if (!times.has(c.time.format('h:mm a'))) {
                        times.set(c.time.format('h:mm a'), [realName + ' – ' + c.className + ' at ' + c.location]);
                    } else {
                        times.get(c.time.format('h:mm a')).push(realName + ' – ' + c.className + ' at ' + c.location)
                    }
                }
            }
            let listOfFields = []
            for (let [time, classes] of times.entries()) {
                let timeField = {name: time, value: classes.join('\n')};
                listOfFields.push(timeField);
            }
            listOfFields.sort(timeSort)

            for (let field of listOfFields) {
                onCampusEmbed.fields.push(field);
            }

        } else {
            onCampusEmbed = {
                color: 0x8300FF,
                title: `Hey, it\'s ${day}`,
                description: `You know people usually don't go to uni today right?`,
            }
        }
    } else {
        onCampusEmbed = {
            color: 0x8300FF,
            title: `Hey, I can't find nothing!`,
            description: `The user doesn't have a calendar registered :/`,
        }
    }

    return onCampusEmbed;
}

function timeSort(a, b) {
    // Convert the time strings to Date objects for comparison
    const dateA = new Date(`01/01/2000 ${a.name}`);
    const dateB = new Date(`01/01/2000 ${b.name}`);

    // Compare the Date objects
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  }

// Note this is for southern hemisphere
function dstOffset() {
    let standardTimezoneOffset  = (new Date('2023-06-01')).getTimezoneOffset();
    let dstTimezoneOffset = (new Date('2023-01-01')).getTimezoneOffset();
    let isDST = standardTimezoneOffset !== dstTimezoneOffset;

    if (isDST) {
        return 11
    } else {
        return 10
    }
}

// Gets relative closest YYYY-MM-DD date string from input like 'sunday'
function getDateFromString(dayString) {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const targetDayOfWeek = daysOfWeek.indexOf(dayString.toLowerCase());

    let daysToAdd;
    if (targetDayOfWeek >= currentDayOfWeek) {
        daysToAdd = targetDayOfWeek - currentDayOfWeek;
    } else {
        daysToAdd = - (currentDayOfWeek - targetDayOfWeek);
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(targetDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


export { addCalendar, getCalendar, parseCalendar, checkClasses, constructEmbed, getDateFromString};
const ical = require('node-ical');
const moment = require('moment-timezone');
const http = require('http'); // or 'https' for HTTPS URLs
const fs = require('fs');
const { DownloaderHelper } = require('node-downloader-helper');

const { createUserEntry, savePersist, loadPersist, userCalendarExists } = require('../dbManage');

function addCalendar(userId, calLink) {
    let userMap = loadPersist();
    let user = userMap.get(userId)

    const filename = calLink.replace("http://my.unsw.edu.au/cal/pttd/", '')
    const dl = new DownloaderHelper(calLink, 'calendars/calFiles');

    dl.on('end', () => console.log('Download Completed'));
    dl.start();

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
        
        const dates = event.rrule.between(new Date(2023, 0, 1, 0, 0, 0, 0), new Date(2023, 11, 31, 0, 0, 0, 0))
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
                todaysClasses.push({className: event.summary, time: start.add(10, 'hours').format('h:mm a'), location: event.location})
            }
        });
        // console.log('-----------------------------------------------------------------------------------------');
        }
    return todaysClasses;
}

async function constructEmbed(client, target = 'everyone', date = 'today') {
    let onCampusEmbed;

    if (userCalendarExists(target) || target === 'everyone') {
        let day = moment(date).day();
        if (isNaN(day)) {
            day = moment().day();
        }
        let daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
        if (daylist[day] !== "Saturday" && daylist[day] !== "Sunday") {
            let atUni = await checkClasses(target, date);
            onCampusEmbed = {
                color: 0x8300FF,
                title: `On campus: ${daylist[day]}`,
                fields: [],
                footer: {
                    text: 'Please note there is no guarantee these people actually attend their classes',
                    icon_url: 'https://static.wikia.nocookie.net/logopedia/images/8/88/Cadbury_Flake_2021.png/revision/latest/scale-to-width-down/1000?cb=20210324190956',
                },
            }
    
            for (let [user, classes] of atUni) {
                let classStr = ""
                for (let c of classes) {
                    classStr += c.time + ': ' + c.className + ' at ' + c.location + '\n';
                }
                let userField = {name: (await client.users.fetch(user)).username, value: classStr}
                onCampusEmbed.fields.push(userField);
            }
        } else if (daylist[day] !== "Saturday" && daylist[day] !== "Sunday"){
            onCampusEmbed = {
                color: 0x8300FF,
                title: `Hey, it\'s ${daylist[today]}`,
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

module.exports = { addCalendar, getCalendar, parseCalendar, checkClasses, constructEmbed };
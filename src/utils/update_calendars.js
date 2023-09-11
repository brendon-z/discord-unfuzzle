import fs from 'fs';

import { loadPersist } from '../database/dbManage.js';
import { addCalendar } from './calendars/calendar.js';

fs.rmSync('calendars/calFiles/', {recursive: true, force: true});
fs.mkdir('calendars/calFiles', (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("New directory created successfully!");
    }
});
let data = loadPersist();

const timer = ms => new Promise(res => setTimeout(res, ms));
async function download() {
  for (const v of data.values()) {
    addCalendar(v.userId, v.calLink);
  }
}

download();

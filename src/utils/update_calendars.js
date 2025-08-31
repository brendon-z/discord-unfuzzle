import fs from 'fs';

import { loadPersist } from '../database/dbManage.js';
import { addCalendar } from './calendars/calendar.js';

if (fs.existsSync('calendars/calFiles/')) {
  fs.rmSync('calendars/calFiles/', {recursive: true, force: true});
}

fs.mkdirSync('calendars/calFiles', { recursive: true });

let data = loadPersist();

const timer = ms => new Promise(res => setTimeout(res, ms));
async function download() {
  for (const v of data.values()) {
    addCalendar(v.userId, v.calLink);
  }
}

download();

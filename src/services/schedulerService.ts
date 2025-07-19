import nodeCron from 'node-cron';
import { closeLongLivedRooms, updateDataToDatabase } from './roomService.js';
import { updateNewMessages, updateRemovedMessages } from './messageService.js';

const EVERY_MINUTE = '* * * * *';

const syncRoomsWithDatabase = async () => {
  await updateDataToDatabase();
  await closeLongLivedRooms();
  await updateNewMessages();
  await updateRemovedMessages();
};

nodeCron.schedule(EVERY_MINUTE, syncRoomsWithDatabase);

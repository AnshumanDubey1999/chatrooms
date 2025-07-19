import nodeCron from 'node-cron';
import { closeLongLivedRooms, updateDataToDatabase } from './roomService';
import { updateNewMessages, updateRemovedMessages } from './messageService';

const EVERY_MINUTE = '* * * * *';

const syncRoomsWithDatabase = async () => {
  await updateDataToDatabase();
  await closeLongLivedRooms();
  await updateNewMessages();
  await updateRemovedMessages();
};

nodeCron.schedule(EVERY_MINUTE, syncRoomsWithDatabase);

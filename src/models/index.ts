/* eslint-disable no-process-exit */
import mongoose from "mongoose";
import { DB_NAME, MONGO_DB_URI } from "../config/env.js";
import { initializeUsers } from "../services/userService.js";
import { initializeRooms } from "../services/roomService.js";
mongoose.Promise = Promise;

export const db = function () {
    mongoose.connect(
        MONGO_DB_URI,
        {
            dbName: DB_NAME
        },
    ).then(async () => {
        console.log('DB connected. Starting initialization!');
        await initializeUsers();
        await initializeRooms();
        console.log('Initialization completed!')
    })

    mongoose.set('debug', true);
    mongoose.connection.on('error', (e) => {
        console.log(
            'MongoDB connection error. Please make sure that MongoDB is running.'
        );
        console.log(e);
        process.exit(1);
    });
};
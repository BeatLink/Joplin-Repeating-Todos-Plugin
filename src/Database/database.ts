import joplin from "api";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Recurrence } from "./entities";

/*
async function demoFsExtra() {
	const fs = joplin.plugins.require('fs-extra');

	const pluginDir = await joplin.plugins.dataDir();
	console.info('Checking if "' + pluginDir + '" exists:', await fs.pathExists(pluginDir));
}

const pluginDir = joplin.plugins.dataDir();

createConnection({
    type: "sqlite",
    database: `${pluginDir}/RecurrenceData.sqlite3`,
    entities: [
        Recurrence
    ],
    synchronize: true,
    logging: false
}).then(connection => {
    // here you can start to work with your entities
}).catch(error => console.log(error));
*/


/*
dbSchema = `CREATE TABLE IF NOT EXISTS RecurrenceData (
    taskid text NOT NULL PRIMARY KEY,

    enabled bool
    intervalnumber
    interval
    weekdaySunday
    weekdayMonday
    weekdayTuesday
    weekdayWednesday
    weekdayThursday
    weekdayFriday
    weekdaySaturday

    login text NOT NULL UNIQUE,
    password text NOT NULL,
    email text NOT NULL UNIQUE,
    first_name text,
    last_name text
);

CREATE TABLE IF NOT EXISTS Blogs (
    id integer NOT NULL PRIMARY KEY,
    user_id integer NOT NULL UNIQUE,
    blog text&nbsp;,
    title text NOT NULL,
    publish_date date,
        FOREIGN KEY (user_id) REFERENCES Users(id)
);`

DB.exec(dbSchema, function(err){
if (err) {
    console.log(err)
}
});

function setupDatabase(){
    const sqlite3 = require('sqlite3').verbose()
    const DB_PATH = ':memory:'
    const DB = new sqlite3.Database(DB_PATH, function(err){
        if (err) {
            console.log(err)
            return
        }
        console.log('Connected to ' + DB_PATH + ' database.')
    });







}
*/
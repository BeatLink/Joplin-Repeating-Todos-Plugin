// Imports ############################################################################################################
import joplin from "api";
import "reflect-metadata";
const fs = joplin.require('fs-extra')
const sqlite3 = joplin.require('sqlite3')

// setupPluginFolder ##################################################################################################
async function setupPluginFolder(directory: string){
    try {
        await fs.ensureDir(directory)
        console.log('success!')
    } catch (err) {
        console.error(err)
    }
}

// setupDatabase ######################################################################################################
export async function setupDatabase(){
    const pluginDir = await joplin.plugins.dataDir();
    const databasePath = pluginDir + "/database.sqlite3";
    await setupPluginFolder(pluginDir)
    console.log(databasePath)
    var database = new sqlite3.Database(databasePath);
}

// Create Tables ######################################################################################################
async function createTables(database){
    database.run(`
        CREATE TABLE Recurrence (
            taskID TEXT PRIMARY KEY, 
            enabled INTEGER,
            interval TEXT,
            intervalNumber INTEGER,
            week_sunday INTEGER,
            week_monday INTEGER,
            week_tuesday INTEGER,
            week_wednesday INTEGER, 
            week_thursday INTEGER, 
            week_friday INTEGER,
            week_saturday INTEGER,
            month_ordinal TEXT, 
            month_weekday TEXT,
            stop_type TEXT,
            stop_date TEXT,
            stop_number INTEGER
        )
    `)
}










/*db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();




/*
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
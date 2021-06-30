/* database.ts ***********************************************************************************/

/* Imports ***************************************************************************************/
import joplin from "api";
import { Recurrence } from "../Logic/recurrence";
import { getAllNotes, getNote } from "../Logic/joplin";
const fs = joplin.require('fs-extra')
const sqlite3 = joplin.require('sqlite3')

/* setupDatabase ********************************************************************************
    Runs the code required for database initialization and record updates. This should run at 
    program start. 
*/
export async function setupDatabase(){
    const pluginDir = await joplin.plugins.dataDir();               // Get Plugin Folder
    await fs.ensureDir(pluginDir)                                   // Create Plugin Folder if it doesnt exist
    const databasePath = pluginDir + "/database.sqlite3";           // Set database path
    var database = new sqlite3.Database(databasePath);              // Create or open database
    await createTable(database);                                    // Create database table if it doesnt exist
    await updateRecurrenceRecords(database);                        // For each todo, create database record if it doesnt exist
    return database
}

/* Create Table *********************************************************************************
    Creates the database table if it doesnt exist
*/
async function createTable(database){                               // Create database table
    database.run(`
        CREATE TABLE IF NOT EXISTS Recurrence (
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

/* updateRecurrenceRecords ***********************************************************************
    This function synchronizes the recurrence database with joplin notes and todos by
    1) Creating a recurrence record for notes whose id is not in the database
    2) Deleting recurrence records from the database if it doesnt have a corresponding note in joplin
    This function should be run at program startup
*/
async function updateRecurrenceRecords(database){
    for (var note of await getAllNotes()){                                      // For note in all notes
        if (await getDatabaseRecord(database, note.id) === undefined){          // If note id is not in recurrence database
            await createDatabaseRecord(database, note.id, new Recurrence())     // Add recurrence record to database
        }
    }
    for (var record of await getAllDatabaseRecords(database)){                  // For recurrence record in recurrence database
        if (!await getNote(record.taskID)){                                     // If corresponding record id not in notes
            await deleteDatabaseRecord(database, record.taskID)                 // delete record
        }
    }
}

/* getDatabaseRecord *****************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding
    note ID. 
    
    Note that sqlite3 is not compatible with async/await functionality, thus the need 
    for the Promise code below. If there are better ways to do this, please let me know.
*/
async function getDatabaseRecord(database, taskID){
    var row = await new Promise((resolve,reject) => {                           // Create Promise for callback
        database.get(                                                           // Run the database get command
            `SELECT * FROM Recurrence WHERE taskID = $id`,                      // SQL Query
            {$id: taskID},                                                      // Parameters
            (err, row) => { if(err) { reject(err) } else { resolve(row) } }     // Callback function written as promise
        )
    })
    return row                                                                  // Return the database record
}

/* deleteDatabaseRecord ****************************************************************************
    This is a helper function that deletes a recurrence record from the database for the corresponding
    note ID.
*/
async function deleteDatabaseRecord(database, taskID){
    await database.run(                                                         // Run the database run command
        `DELETE FROM Recurrence WHERE taskID = $id`,                            // SQL Query
        {$id: taskID}                                                           // Parameters
    )
}

/* getallDatabaseRecords **************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding
    note ID. 
    
    Note that sqlite3 is not compatible with async/await functionality, thus the need for the Promise
    code below. If there are better ways to do this, please let me know
*/
async function getAllDatabaseRecords(database): Promise<Array<any>>{
    var rows: Array<any> = await new Promise((resolve,reject) => {              // Create promise for callback
        database.all(                                                           // Runs the database all command
            `SELECT * FROM Recurrence`,                                         // SQL Query
            (err, row) => { if(err) { reject(err) } else { resolve(row) } }     // Callback function written as promise
        )
    })
    return rows                                                                 // Return the database records
}

/* createDatabaseRecords **************************************************************************
    This is a helper function that creates a new recurrence record in the recurrence database
    when given the noteID and recurrence data object.
*/
async function createDatabaseRecord(database, taskID, recurrence:Recurrence){
    database.run(                                                               // Run the database run command
        `INSERT INTO Recurrence VALUES (
            $id, 
            $enabled, 
            $interval, 
            $intervalNumber, 
            $week_sunday, 
            $week_monday, 
            $week_tuesday, 
            $week_wednesday, 
            $week_thursday,
            $week_friday,
            $week_saturday,
            $month_ordinal,
            $month_weekday,
            $stop_type,
            $stop_date,
            $stop_number
        );`, {                                                                  // Parameters
            $id: taskID,
            $enabled: recurrence.enabled,
            $interval: recurrence.interval,
            $week_sunday: recurrence.weekdays.sunday,
            $week_monday: recurrence.weekdays.monday,
            $week_tuesday: recurrence.weekdays.tuesday,
            $week_wednesday: recurrence.weekdays.wednesday,
            $week_thursday: recurrence.weekdays.thursday,
            $week_friday: recurrence.weekdays.friday,
            $week_saturday: recurrence.weekdays.saturday,
            $month_ordinal: recurrence.weekdayOfMonth.ordinal,
            $month_weekday: recurrence.weekdayOfMonth.weekday,
            $stop_type: recurrence.stopInfo.type,
            $stop_date: recurrence.stopInfo.date,
            $stop_number: recurrence.stopInfo.number
        }
    )
}

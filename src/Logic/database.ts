/* database.ts **********************************************************************************

    This file contains all functions involved in managing the recurrence database. This sqlite3
    recurrence database is stored in the plugin directory and holds all of the specific details
    about how each task in joplin would recur if at all. Each recurrence id in the database
    corresponds with the note/task id in joplin which the recurrence affects.

*/

/* Imports ***************************************************************************************/
import joplin from "api";
import { Recurrence } from "./recurrence";
import { getAllNotes, getNote } from "./joplin";
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
    await createRecurrenceTable(database);                          // Create database table if it doesnt exist
    await updateDatabase(database);                                 // Synchronizes the recurrence database with the joplin state
    return database
}

/* Create Table *********************************************************************************
    Creates the database table if it doesnt exist
*/
async function createRecurrenceTable(database){                     // Create database table if it doesnt exist
    database.run(`
        CREATE TABLE IF NOT EXISTS Recurrence (
            id TEXT PRIMARY KEY, 
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

/* updateDatabase ********************************************************************************
    This function synchronizes the recurrence database with joplin notes and todos by
    1) Creating a recurrence record in the database for each note/todo in joplin if it doesnt exist
    2) Deleting recurrence records from the database if it doesnt have a corresponding note in joplin
    This function should be run at program startup
*/
async function updateDatabase(database){
    for (var note of await getAllNotes()){                          // For note in all notes
        if (!await getRecord(database, note.id)){                   // If note id is not in recurrence database
            var recurrence = new Recurrence()                       // Create new recurrence object
            await createRecord(database, note.id, recurrence)       // Add recurrence record to database
        }
    }
    for (var record of await getAllRecords(database)){              // For recurrence record in recurrence database
        if (!await getNote(record.id)){                             // If corresponding record id not in notes
            await deleteRecord(database, record.id)                 // delete record
        }
    }
}

/* getallDatabaseRecords **************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding
    note ID. 
    
    Note that sqlite3 is not compatible with async/await functionality, thus the need for the Promise
    code below. If there are better ways to do this, please let me know
*/
async function getAllRecords(database){
    var records: Array<any> = await new Promise((resolve,reject) => {           // Create promise for callback
        database.all(                                                           // Runs the database all command
            `SELECT * FROM Recurrence`,                                         // SQL Query
            (err, row) => { if(err) { reject(err) } else { resolve(row) } }     // Callback function written as promise
        )
    })
    var recurrences = []                                                        // Create final recurrences array
    for (var record of records){                                                // for each record in the returned records
        recurrences.push({                                                      // Push to the recurrences array an object consisting of
            id: record.id,                                                      // the recurrence id...
            recurrence: convertRecordToRecurrence(record)                       // and the recurrence itself
        })
    }
    return recurrences                                                          // Return the database records
}

/* getDatabaseRecord *****************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding
    note ID. 
    
    Note that sqlite3 is not compatible with async/await functionality, thus the need 
    for the Promise code below. If there are better ways to do this, please let me know.
*/
export async function getRecord(database, id): Promise<Recurrence>{
    var record: any = await new Promise((resolve,reject) => {                   // Create Promise for callback
        database.get(                                                           // Run the database get command
            `SELECT * FROM Recurrence WHERE id = $id`,                          // SQL Query
            {$id: id},                                                          // Parameters
            (err, row) => { if(err) { reject(err) } else { resolve(row) } }     // Callback function written as promise
        )
    })
    return record != undefined ? convertRecordToRecurrence(record) : null       // If record isnt undefined, return the converted recurrence object, else null
}

/* createDatabaseRecords **************************************************************************
    This is a helper function that creates a new recurrence record in the recurrence database
    when given the noteID and recurrence data object.
*/
async function createRecord(database, id: string, recurrence:Recurrence){
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
            $id: id,
            $enabled: recurrence.enabled,
            $interval: recurrence.interval,
            $intervalNumber: recurrence.intervalNumber,
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

/* deleteDatabaseRecord ****************************************************************************
    This is a helper function that deletes a recurrence record from the database for the corresponding
    note ID.
*/
async function deleteRecord(database, id){
    await database.run(                                                         // Run the database run command
        `DELETE FROM Recurrence WHERE id = $id`,                            // SQL Query
        {$id: id}                                                           // Parameters
    )
}


function convertRecordToRecurrence(record): Recurrence{
    var recurrence = new Recurrence()
    recurrence.enabled = record.enabled == 1 ? true : false 
    recurrence.interval = record.interval
    recurrence.intervalNumber = record.intervalNumber
    recurrence.weekdays.sunday = record.week_sunday == 1 ? true : false
    recurrence.weekdays.monday = record.week_monday == 1 ? true : false
    recurrence.weekdays.tuesday = record.week_tuesday == 1 ? true : false
    recurrence.weekdays.wednesday = record.week_wednesday == 1 ? true : false
    recurrence.weekdays.thursday = record.week_thursday == 1 ? true : false
    recurrence.weekdays.friday = record.week_friday == 1 ? true : false
    recurrence.weekdays.saturday = record.week_saturday == 1 ? true : false
    recurrence.weekdayOfMonth.ordinal = record.month_ordinal
    recurrence.weekdayOfMonth.weekday = record.month_weekday
    recurrence.stopInfo.type = record.stop_type
    recurrence.stopInfo.date = record.stop_date
    recurrence.stopInfo.number = record.stop_number
    return recurrence
}
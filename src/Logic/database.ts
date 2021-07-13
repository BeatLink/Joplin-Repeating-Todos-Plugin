/* database.ts ****************************************************************************************************************************

    This file contains all functions involved in managing the recurrence database. This sqlite3 recurrence database is stored in the 
    plugin directory and holds all of the specific details about how each task in joplin would recur if at all. Each recurrence id in the 
    database corresponds with the note/task id in joplin which the recurrence affects.

******************************************************************************************************************************************/

/* Imports *******************************************************************************************************************************/
import joplin from "api";
import { Recurrence } from "./recurrence";
import { getAllNotes, getNote } from "./joplin";
const fs = joplin.require('fs-extra')
const sqlite3 = joplin.require('sqlite3')

/* setupDatabase **************************************************************************************************************************
    Runs the code required for database initialization and record updates. This should run at  program start. 
*/
export async function setupDatabase(){
    const pluginDir = await joplin.plugins.dataDir();                   // Get Plugin Folder
    await fs.ensureDir(pluginDir)                                       // Create Plugin Folder if it doesnt exist
    const databasePath = pluginDir + "/database.sqlite3";               // Set database path
    var database = new sqlite3.Database(databasePath);                  // Create or open database
    await createRecurrenceTable(database);                              // Create database table if it doesnt exist
    await updateDatabase(database);                                     // Synchronizes the recurrence database with the joplin state
    return database;                                                    // Returns the database
}

/* Create Table ***************************************************************************************************************************
    Creates the database table if it doesnt exist
*/
async function createRecurrenceTable(database){
    var createQuery = `
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
    `                                                                   // SQL Query
    runQuery(database.run, createQuery, null)                           // Run database create table command 
}

/* updateDatabase *************************************************************************************************************************
    This function synchronizes the recurrence database with joplin notes and todos by:
        1) Creating a recurrence record in the database for each note/todo in joplin if it doesnt exist
        2) Deleting recurrence records from the database if it doesnt have a corresponding note in joplin
    This function should be run at program startup
*/
async function updateDatabase(database){
    for (var note of await getAllNotes()){                              // For note in all notes
        if (!await getRecord(database, note.id)){                       // If note id is not in recurrence database
            await createRecord(database, note.id, new Recurrence())     // Add blank recurrence object to database
        }
    }
    for (var record of await getAllRecords(database)){                  // For recurrence record in recurrence database
        if (!await getNote(record.id)){                                 // If corresponding record id not in notes
            await deleteRecord(database, record.id)                     // delete record
        }
    }
}

/* getallDatabaseRecords ******************************************************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding note ID. 
*/
async function getAllRecords(database){
    var records: Array<any> = null;                                     // Initializes the database records variable
    var selectQuery = `SELECT * FROM Recurrence`                        // SQL Query to select all records
    records = await runQuery(database.all, selectQuery, null);          // runs the query and saves the result to the variable
    var recurrences = []                                                // Create final recurrence array
    for (var record of records){                                        // for each record in the returned records
        recurrences.push({                                              // Push to the recurrences array an object consisting of
            id: record.id,                                              // the recurrence id...
            recurrence: getRecordAsRecurrence(record)                   // and the recurrence itself
        })
    }
    return recurrences                                                  // Return the recurrence array
}

/* getDatabaseRecord **********************************************************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding note ID. 
    Note that sqlite3 is not compatible with async/await functionality, thus the need for the query to be written as a promise. If there 
    are better ways to do this, please let me know
*/
export async function getRecord(database, id): Promise<Recurrence>{
    var record: any = null;                                             // Initialize database record variable
    var selectQuery = `SELECT * FROM Recurrence WHERE id = $id`         // Create SQL Query for the command
    var selectParameter = {$id: id}                                     // Create SQL Parameters for command
    record = await runQuery(database.get, selectQuery, selectParameter) // Runs the query and saves the result to the variable
    return record != undefined ? getRecordAsRecurrence(record) : null   // Returns record as recurrence if it exists, otherwise null
}

/* createDatabaseRecords ******************************************************************************************************************
    This is a helper function that creates a new recurrence record in the recurrence database when given the noteID and recurrence data 
    object.
*/
async function createRecord(database, id: string, recurrence:Recurrence){
    var insertQuery = `INSERT INTO Recurrence VALUES ($id);`            // SQL Query
    var insertParameters = {$id: id}                                    // Parameter
    await runQuery(database.run, insertQuery, insertParameters)         // Run the database insertion command
    await updateRecord(database, id, recurrence);                       // Runs the database update record command
}

/* UpdateDatabaseRecord *******************************************************************************************************************
    This is a helper function that updates a recurrence record in the database when given the noteID and recurrence data object
*/
export async function updateRecord(database, id: string, recurrence:Recurrence){
    var updateQuery = `
        UPDATE Recurrence
        SET
            enabled = $enabled,
            interval = $interval,
            intervalNumber = $intervalNumber,
            week_sunday = $week_sunday,
            week_monday = $week_monday,
            week_tuesday = $week_tuesday,
            week_wednesday = $week_wednesday,
            week_thursday = $week_thursday,
            week_friday = $week_friday,
            week_saturday = $week_saturday,
            month_ordinal = $month_ordinal,
            month_weekday = $month_weekday,
            stop_type = $stop_type,
            stop_date = $stop_date,
            stop_number = $stop_number
        WHERE id = $id
    `                                                                   // SQL Query
    var updateParameters = {                                            // Parameters
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
    await runQuery(database.run, updateQuery, updateParameters)         // Runs the database update query
}

/* deleteDatabaseRecord *******************************************************************************************************************
    This is a helper function that deletes a recurrence record from the database for the corresponding note ID.
*/
async function deleteRecord(database, id){
    var deleteQuery = `DELETE FROM Recurrence WHERE id = $id`           // SQL Query
    var deleteParameters = {$id: id}                                    // Parameters
    await runQuery(database.run, deleteQuery, deleteParameters)         // Run the database run command
}

/* runDatabaseQuery *********************************************************************************************************************
    Sqlite3 does not support async/await functionality, thus the need for this promise based function to ruin the sqlite functions. 
    If there are better ways to do this, please let me know
*/
async function runQuery(databaseFunction, SQLQuery, parameters): Promise<any>{
    return await new Promise(                                           // Processes the below promise and returns the result
        (resolve, reject) => {                                          // Create the promise function
            databaseFunction(                                           // Runs the passed database function with...
                SQLQuery,                                               // the passed sql query...
                parameters,                                             // the passed parameters...
                (err, row) => { err ? reject(err) : resolve(row) }      // and the database callback written as a promise processor
            )
        }
    )
}

/* convertTecordToRecurrence **************************************************************************************************************
    This is a helper function to convert a database record from an sqlite3 output to a recurrence object
*/
function getRecordAsRecurrence(record): Recurrence{
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


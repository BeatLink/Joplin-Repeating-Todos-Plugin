import joplin from "api";
const plugins = joplin.plugins as any
const sqlite3 = plugins.require('sqlite3')


async function createTables(database){
    "CREATE TABLE Weekdays (weekdayID TEXT PRIMARY KEY, sunday INTEGER, monday INTEGER, tuesday INTEGER, wednesday INTEGER, thursday INTEGER, friday INTEGER, saturday INTEGER)"

    "CREATE TABLE WeekdayOfMonth (taskID TEXT PRIMARY KEY, ordinal TEXT, weekday TEXT)"

    "CREATE TABLE StopData (taskID TEXT PRIMARY KEY, type TEXT, date TEXT, number INTEGER)"


    database.run("CREATE TABLE Recurrence (taskID TEXT PRIMARY KEY, enabled INTEGER, interval TEXT, intervalNumber INTEGER, FOREIGN KEY (weekdays) REFERENCES Weekdays(weekdayID))")
}







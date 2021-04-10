

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
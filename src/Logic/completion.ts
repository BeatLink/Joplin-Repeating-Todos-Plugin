import joplin from "api";
import { getRecord, updateRecord } from "./database";
import { getAllNotes, getNote, markTaskUncompleted } from "./joplin";

var timer = null
var timerTaskID = ""
var nextDates = [];

/* setupTaskCompletion ********************************************************************************************************************
    Initializes all the logic of handling completed tasks
 */
export async function setupTaskCompletion(){
    for (var note of await getAllNotes()){                              // For note/todo in all notes
        await processRecurrence(note.id)                                      // process the task
    }
    await joplin.workspace.onNoteChange(async (event) => {                    // Setup task completed handler
        console.log('note changed', event)
        if (event.event == 2){                                          // If task was changed/completed
            await processRecurrence(event.id)                                 // process the task
        }
    })
}

/* processRecurrence **********************************************************************************************************************
    Determines whether task should be reset and if yes, adds it to the nextDatesArray
 */
export async function processRecurrence(id){
    var task = await getNote(id)                                        // Get data for task
    var recurrence = await getRecord(id)                                // Get recurrence data for task
    console.log(task)
    console.log(recurrence)
    if (task.todo_completed != 0 && recurrence.enabled){                // If task is done and recurrence is enabled
        var initialDate = new Date(task.todo_completed)                 // Create initial date
        var nextDate = recurrence.getNextDate(initialDate)              // Calculate next date from initial date
        updateNextDatesArray({id: id, nextDate: nextDate})              // Create next Date Object and ensure it is in the array
    } //else //if (getIndex(task.id) && (task.todo_completed == 0 || !recurrence.enabled) ){
       // removeNextDate(task.id)
    //}
    console.log('process recurrence', nextDates)
}

/* updateNextDates ************************************************************************************************************************
    If the given nextDates object is not in the array, add it, otherwise, update it
*/
function updateNextDatesArray(nextDateObject){
    if (getIndex(nextDateObject.id) == -1){                             // If object's id is not found in the array
        nextDates.push(nextDateObject)                                  // add the object to the array
    } else {                                                            // Else
        nextDates[getIndex(nextDateObject.id)] = nextDateObject         // update the existing object with the new one
    }
    console.log(nextDates)
    //updateTimer()                                                       // Update the timer
}

/* updateTimer ****************************************************************************************************************************
    Creates or updates the timer to reset the closest task
*/
async function updateTimer(){
    console.log('updating timer', timer)
    if (timer) {clearTimeout(timer)}                                    // Clears any existing timers
    sortNextDatesArray()                                                // Sort the next date array from the soonest to the latest
    console.log(nextDates)
    var soonestRecurrence = nextDates[0]                                // Gets the soonest task to be reset
    console.log(`Soonest Recurrence `, soonestRecurrence)
    if (soonestRecurrence) {
        timerTaskID = soonestRecurrence.id                              // Saves the task id
        var resetTime = soonestRecurrence.nextDate - Date.now()         // Calculate the time for the timer
        console.log('setting timeout')
        timer = setTimeout(resetTask, resetTime);                       // creates a new timer for the task with the callback 
        console.log('timeout set')   
    }
}

/* resetTask ******************************************************************************************************************************
    Resets the task by marking it as uncompleted and updating the recurrence state
*/
async function resetTask(){
    await markTaskUncompleted(timerTaskID)                              // Marks the task as uncomplete
    var recurrence = await getRecord(timerTaskID)                       // Gets the recurrence from the database
    recurrence.updateStopStatus()                                       // Updates the recurrence stop status
    updateRecord(timerTaskID, recurrence)                               // Saves the changed recurrence data to the database
    removeNextDate(timerTaskID)                                         // Deletes the task from the next dates array
    updateTimer()                                                       // updates the timer
}



    


// On Program Start
// for all tasks with completion dates and recurrence.enabled == true
// Calculate next date
// append to array
// Sort array from soonest to farthest
// update timer

function removeNextDate(id){
    nextDates.splice(getIndex(id), 1)
}

function getIndex(id){
    return nextDates.findIndex(element => element.id == id)
}

function sortNextDatesArray(){
    function nextDaySortFunc(a,b){
        return a.nextDate.getTime() - b.nextDate.getTime()
    }
    nextDates.sort(nextDaySortFunc)
}

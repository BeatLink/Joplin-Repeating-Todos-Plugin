import joplin from "api";
import { getRecord, updateRecord } from "./database";
import { getCompletedNotes, markTaskUncompleted } from "./joplin";

var timers: {[id: string]: NodeJS.Timeout} = {}

/* reviewCompletedTasks ********************************************************************************************************************
    Processes completed tasks every 30 for any changes. 
 */
export async function reviewCompletedTasks(){
    for (var note of await getCompletedNotes()){                        // For note in completed notes
        await processRecurrence(note)                                   // Process Note
    }
    setInterval(await reviewCompletedTasks, 300000)                     // Run loop again after 60 seconds    
}

/* processRecurrence **********************************************************************************************************************
    Determines whether task should be reset and if yes, adds it to the nextDatesArray
 */
export async function processRecurrence(task){
    if (!timers[task.id]){                                              // If task doesnt have a timer already...
        var recurrence = await getRecord(task.id)                       // Get recurrence data for task
        if (recurrence.enabled){                                        // If recurrence is enabled for the task
            var initialDate = new Date(task.todo_completed)             // Create initial date from todo completion datetime
            var nextDate = recurrence.getNextDate(initialDate)          // Calculate next date from initial date
            var resetTime = nextDate.getTime() - Date.now()             // Converts the next date into a reset time for the timer
            var timer = setTimeout(await resetTask, resetTime, task.id) // Creates a timer to trigger the task reset
            timers[task.id] = timer                                     // Adds the timer to timers object to track its existence
        }
    } else if (timers[task.id] && !task.todo_completed){                // Else if timer is still in timers but the todo is no longer completed
        clearTimeout(timers[task.id])                                   // Clear the timer
        delete timers[task.id]                                          // Delete the timer from timers
    }
}

/* resetTask ******************************************************************************************************************************
    Resets the task by marking it as uncompleted and updating the recurrence state
*/
async function resetTask(id){
    await markTaskUncompleted(id)                                       // Marks the task as uncomplete
    var recurrence = await getRecord(id)                                // Gets the recurrence from the database
    recurrence.updateStopStatus()                                       // Updates the recurrence stop status
    updateRecord(id, recurrence)                                        // Saves the changed recurrence data to the database
    clearTimeout(timers[id])                                            // Clears the timer if it still exists
    delete timers[id]                                                   // Deletes the timer from the timers object
}
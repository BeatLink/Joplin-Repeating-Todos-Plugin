/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { openDialog } from '../gui/dialog/dialog';
import { createRecord, getAllRecords, getRecord, updateRecord, deleteRecord} from './database';
import { getAllNotes, getNote, markTaskIncomplete, setTaskDueDate, markSubTasksIncomplete, markTaskComplete } from "./joplin";
import { Recurrence } from '../model/recurrence';
import { start } from 'repl';
import { sleep } from './misc';

/** openRecurrenceDialog ****************************************************************************************************************************
 * Opens the recurrence dialog with recurrence data for the current note and saves the recurrence data to the database on dialog closure            *
 ***************************************************************************************************************************************************/
 export async function openRecurrenceDialog(){
    var selectedNote = await joplin.workspace.selectedNote()
    var oldRecurrence = await getRecord(selectedNote.id)
    var newRecurrence = await openDialog(oldRecurrence)
    if (newRecurrence){
        await updateRecord(selectedNote.id, newRecurrence)
    }
}

/** updateDatabase **********************************************************************************************************************************
 * This function synchronizes the recurrence database with joplin notes and todos by Creating a recurrence record in the database for each          *
 * note/todo in joplin if it doesnt exist and deleting recurrence records from the database if it doesnt have a corresponding note in joplin        *
 ***************************************************************************************************************************************************/
export async function updateAllRecurrences(){
    var allNotes = await getAllNotes()
    var allRecurrences = await getAllRecords()
    for (var note of allNotes){
        if (!allRecurrences.some(record => record.id == note.id)){
            await createRecord(note.id, new Recurrence())
        }
        await processTodo(note)
    }
    for (var record of allRecurrences){
        if (!allNotes.some(note => note.id == record.id)){
            await deleteRecord(record.id)
        }
    }
}

export async function updateOverdueTodos(){
    var startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    for (var note of await getAllNotes()){
        while (true){
            var todo = await getNote(note.id)
            var initialDate = new Date(todo.todo_due)
            var recurrence = await getRecord(todo.id)
            if ((todo.todo_due == 0) || (!recurrence.enabled) || initialDate > startOfToday){
                break;
            } else {
                await markTaskComplete(note.id)
                await processTodo(note.id)
                sleep(1000)    
            }
        }
    }
    joplin.views.dialogs.showMessageBox("Overdue Tasks Rescheduled")
}

/** processTodo *************************************************************************************************************************************
 * If the given todo has been completed and has a due date and recurrence is enable, the todo due date will be updated to the next due date and the *
 * task flagged as incomplete. The recurrence stop criteria is also processed, deactivating recurrence if the stop date is passed or the stop number*
 * falls below 1.                                                                                                                                   *
 ***************************************************************************************************************************************************/
async function processTodo(todo){
    var recurrence = await getRecord(todo.id)
    if ((todo.todo_completed != 0) && (todo.todo_due != 0) && (recurrence.enabled)){
        var initialDate = new Date(todo.todo_due)
        var nextDate = recurrence.getNextDate(initialDate)
        await setTaskDueDate(todo.id, nextDate)
        await markTaskIncomplete(todo.id)
        await markSubTasksIncomplete(todo.id)
        recurrence.updateStopStatus()
        updateRecord(todo.id, recurrence)
    }
}

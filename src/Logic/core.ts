/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { createDialog, openDialog} from '../GUI/Dialog/Dialog';
import { setupDialogButton } from '../GUI/DialogButton';
import { setupUpdateMenu } from '../GUI/UpdateMenu';
import { setupDatabase, createRecord, getAllRecords, getRecord, updateRecord, deleteRecord} from '../Logic/database';
import { getAllNotes, getNote, markTaskUncompleted, setTaskDueDate, connectNoteChangedCallback } from "../Logic/joplin";
import { Recurrence } from './recurrence';


/** Main ********************************************************************************************************************************************
 * Calls all the functions needed to initialize the plugin                                                                                          *
 ***************************************************************************************************************************************************/
export async function main() {
    await setupDatabase()
    await createDialog()
    await setupUpdateMenu()
    await setupDialogButton()
    await connectNoteChangedCallback(noteUpdateHandler)
}

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
export async function updateDatabase(){
    for (var note of await getAllNotes()){
        if (!await getRecord(note.id)){
            await createRecord(note.id, new Recurrence())
        }
        processTodo(note.id)
    }
    for (var record of await getAllRecords()){
        if (!await getNote(record.id)){
            await deleteRecord(record.id)
        }
    }
}

/** noteUpdateHander ********************************************************************************************************************************
 * This function is called whenever a note changes. If a note is deleted, the corresponding recurrence record is deleted from the database.         *
 * If a note is created, its corresponding record is created in the database. If a note is updated, then the todo is processed. See processTodo for *
 * details.                                                                                                                                         *
 ***************************************************************************************************************************************************/
async function noteUpdateHandler(event){
    if (event.type == 1){
        if (!await getRecord(event.item_id)){
            await createRecord(event.item_id, new Recurrence())
        }
    } else if (event.type == 2) {
        await processTodo(event.item_id)
    } else if (event.type = 3){
        await deleteRecord(event.id)
    }
    
}


/** processTodo *************************************************************************************************************************************
 * If the given todo has been completed and has a due date and recurrence is enable, the todo due date will be updated to the next due date and the *
 * task flagged as incomplete. The recurrence stop criteria is also processed, deactivating recurrence if the stop date is passed or the stop number*
 * falls below 1.                                                                                                                                   *
 ***************************************************************************************************************************************************/
async function processTodo(todoID){
    var todo = await getNote(todoID)
    var recurrence = await getRecord(todoID)
    if ((todo.todo_completed != 0) && (todo.todo_due != 0) && (recurrence.enabled)){
        var initialDate = new Date(todo.todo_due)
        var nextDate = recurrence.getNextDate(initialDate)
        await setTaskDueDate(todoID, nextDate)
        await markTaskUncompleted(todoID)
        recurrence.updateStopStatus()
        updateRecord(todoID, recurrence)
    }
}

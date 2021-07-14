/* Imports *******************************************************************************************************************************/
import { createDialog, openDialog, setRecurrence, getRecurrence } from '../GUI/Dialog/Dialog';
import { setupDialogButton } from '../GUI/DialogButton';
import { setupDatabase, getRecord, updateRecord } from './database';
import { getSelectedNote } from './joplin';
import { Recurrence } from './recurrence';


/* Global Variables **********************************************************************************************************************/
var database = null;
var dialog = null;


/* onRecurrenceDialogButtonClicked *******************************************************************************************************/
export async function onRecurrenceDialogButtonClicked(){
    var selectedNote = await getSelectedNote()                         // Get current note
    var selectedNoteID = selectedNote.id                               // Get ID of selected note
    var oldRecurrence = await getRecord(database, selectedNoteID)      // Get recurrence data for current note
    var newRecurrence = await openDialog(dialog, oldRecurrence);
    console.log(newRecurrence)
    if (newRecurrence){
        await updateRecord(database, selectedNoteID, newRecurrence)
    }
    //var newRecurrence = await getRecurrence(dialog);                       // open dialog

// get results from dialog on closing
// save results to database
    //await loadRecurrence(dialog, recurrenceData);                   // Load Data into Dialog
    
//    return (result.id == 'ok'? await getRecurrence(result) : null);     //return data
    //get data
    // Get a note ID, title and body
    //const noteId = 'some_note_id';
    //const note = await joplin.data.get(['notes', "fe78a506b15d46b9b142e1def34ee7f6"], { fields: ['id', 'title', 'body'] });
    //console.log(note)
    // get recurrence data from persistence
    //console.log(recurrenceResult)                
    //save results from dialog to persistence
    //return getRecurrence();
    //export async function openDialog(dialogHandle, RecurrenceData) {
    //}
}


export async function onTaskCompleted(){
}

//Completing a Task
    //When user checks a task as complete, "reset date" is calculated from recurrence details and appended to list
//Resetting the task
  //  Loop checks list for any reset date that has passed and if yes, unchecks the recurrence date for that task, allowing the task to be done again

/* Main **********************************************************************************************************************************/
export async function main() {
    await console.info('Repeating To-Dos Plugin started!');         // Log startup to console
    database = await setupDatabase();                               // Setup Database
    dialog = await createDialog();                                  // Setup Dialog
    await setupDialogButton();                                      // Setup Dialog Button

    //await setupTaskCompleted();
    //await setupMainLoop();
}

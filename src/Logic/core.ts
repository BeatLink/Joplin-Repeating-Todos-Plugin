/* Imports *******************************************************************************************************************************/
import { createDialog, openDialog} from '../GUI/Dialog/Dialog';
import { setupDialogButton } from '../GUI/DialogButton';
import { setupDatabase, getRecord, updateRecord } from './database';
import { getSelectedNote } from './joplin';

/* Global Variables **********************************************************************************************************************/
var database = null;
var dialog = null;


/* onRecurrenceDialogButtonClicked *******************************************************************************************************/
export async function onRecurrenceDialogButtonClicked(){
    var selectedNote = await getSelectedNote()                         // Get current note
    var selectedNoteID = selectedNote.id                               // Get ID of selected note
    var oldRecurrence = await getRecord(database, selectedNoteID)      // Get recurrence data for current note
    var newRecurrence = await openDialog(dialog, oldRecurrence);
    console.log(newRecurrence.getString())
    console.log(newRecurrence.getNextDate(new Date()))
    if (newRecurrence){
        await updateRecord(database, selectedNoteID, newRecurrence)
    }
}

export async function onTaskCompleted(){

//Completing a Task
    //When user checks a task as complete, "reset date" is calculated from recurrence details and appended to list
}

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

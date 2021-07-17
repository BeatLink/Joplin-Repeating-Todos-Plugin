/* Imports *******************************************************************************************************************************/
import joplin from 'api';
import { createDialog, openDialog} from '../GUI/Dialog/Dialog';
import { setupDialogButton } from '../GUI/DialogButton';
import { setupDatabase, getRecord, updateRecord } from './database';
import { getSelectedNote } from './joplin';
import { setupTaskCompletion } from './completion'


/* onRecurrenceDialogButtonClicked ******************************************************************************************************

*/
export async function onRecurrenceDialogButtonClicked(){
    var selectedNote = await getSelectedNote()                          // Get current note
    var selectedNoteID = selectedNote.id                                // Get ID of selected note
    var oldRecurrence = await getRecord(selectedNoteID)       // Get recurrence data for current note
    var newRecurrence = await openDialog(oldRecurrence);        // Load recurrence data into recurrence dialog, Open recurrence dialog and save new recurrence
    if (newRecurrence){
        await updateRecord(selectedNoteID, newRecurrence)
    }
}


/* Main **********************************************************************************************************************************/
export async function main() {
    await console.info('Repeating To-Dos Plugin started!');             // Log startup to console
    await setupDatabase();                                              // Setup Database
    await createDialog();                                               // Setup Dialog
    await setupDialogButton();                                          // Setup Dialog Button
    //await setupTaskCompletion()                                         // Setup task completion logic
    joplin.workspace.onNoteChange(async (event) => await console.log('note changed', event))
}

import joplin from 'api';
import { createDialog, openDialog } from '../GUI/Dialog/Dialog';
import { setupToolbar } from '../GUI/Toolbar/Toolbar';
import { setupDatabase } from '../Database/database';

var dialog = null;

async function openRecurrenceDialog(){
    //get recurrence data from persistence
    var recurrenceResult = await openDialog(dialog, null);         // open dialog with recurrence data
    console.log(recurrenceResult)
    //save results from dialog to persistence

}

async function setupGUI(){
    dialog = await createDialog();
    await setupToolbar(openRecurrenceDialog);
}


// Main ###########################################################################################
export async function main() {

    //Log startup to console
    await console.info('Repeating To-Dos Plugin started!');

    await setupDatabase();

    //Setup UI
    await setupGUI();

}



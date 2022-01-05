/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { noteUpdateHandler, updateAllRecurrences } from './core/updates';
import { setupDatabase } from './core/database';
import { connectNoteChangedCallback } from './core/joplin';
import { setupDialog } from './gui/dialog';
import { setupControls } from './gui/controls';


/** Plugin Registration *****************************************************************************************************************************
 * Registers the plugin with joplin.                                                                                                                *
 ***************************************************************************************************************************************************/
joplin.plugins.register({
    onStart: main,
});

/** Main ********************************************************************************************************************************************
 * Calls all the functions needed to initialize the plugin                                                                                          *
 ***************************************************************************************************************************************************/
async function main() {
    await setupDatabase()
    await setupDialog()
    await setupControls()
    await updateAllRecurrences()
    await connectNoteChangedCallback(noteUpdateHandler)
}
/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupDatabase } from './core/database';
import { setupDialog } from './gui/dialog';
import { setupControls } from './gui/controls';
import { setupTimer } from './core/timer';
import { setupSettings } from './core/settings';

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
    await setupSettings()
    await setupTimer()
}
/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupDatabase } from './core/database';
import { setupDialog } from './gui/dialog/dialog';
import { setupMenu } from './gui/menu';
import { setupTimer } from './core/timer';
import { setupSettings } from './core/settings';
import { setupToolbar } from './gui/toolbar';
import { setupCommands } from './core/commands';

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
    await setupSettings()
    await setupCommands()
    await setupDialog()
    await setupMenu()
    await setupToolbar()
    await setupTimer()
}
/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { MenuItemLocation } from 'api/types';
import { ToolbarButtonLocation } from 'api/types';
import { openRecurrenceDialog, updateAllRecurrences } from '../core/recurrence';

/** setupCommands ***********************************************************************************************************************************
 * Sets up all commands used by toolbar buttons and menu items                                                                                      *
 ***************************************************************************************************************************************************/
async function setupCommands(){
    await joplin.commands.register({
        name: 'updateAllRecurrences',
        label: 'Update All Recurrence Information',
        iconName: 'fas fa-redo-alt',
        execute: updateAllRecurrences
    })
    await joplin.commands.register({
        name: 'openRecurrenceDialog',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: openRecurrenceDialog
    })
}

/** setupMenu ***************************************************************************************************************************************
 * Sets up the menu used by the plugin                                                                                                              *
 ***************************************************************************************************************************************************/
async function setupMenu(){
    await joplin.views.menus.create(
        'recurrenceMenu', 
        "Repeating Todos", 
        [{commandName: 'updateAllRecurrences'}],
        MenuItemLocation.Tools
    )
}

/** setupToolbarButton ******************************************************************************************************************************
 * Sets up buttons on the toolbar for the plugin                                                                                                    *
 ***************************************************************************************************************************************************/
async function setupToolbar(){
    console.log("setting up toolbar")
    await joplin.views.toolbarButtons.create(
        'openRecurrenceDialogButton',
        'openRecurrenceDialog',
        ToolbarButtonLocation.NoteToolbar
    );
}

/** setupControls ***********************************************************************************************************************************
 * Sets up all the toolbar buttons and menus for the plugin                                                                                         *
 ***************************************************************************************************************************************************/
export async function setupControls(){
    await setupCommands()
    await setupMenu()
    await setupToolbar()
}

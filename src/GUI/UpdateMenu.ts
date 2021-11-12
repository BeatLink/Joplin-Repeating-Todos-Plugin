/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { MenuItemLocation } from 'api/types';
import { updateDatabase } from '../Logic/core';

/** setupDialogButton *******************************************************************************************************************************
 * Sets up the button on the toolbar that opens the recurrence dialog                                                                               *
 ***************************************************************************************************************************************************/
export async function setupUpdateMenu(){
    await joplin.commands.register({
        name: 'updateRecurrenceDatabase',
        label: 'Update Recurrence Database',
        iconName: 'fas fa-redo-alt',
        execute: async () => {
            updateDatabase();
        },
    });
    await joplin.views.menus.create(
        'recurrenceMenu', "Repeating Todos", 
        [{label: "updateRecurrenceDatabase", commandName: 'updateRecurrenceDatabase'}],
        MenuItemLocation.Tools
    )
}

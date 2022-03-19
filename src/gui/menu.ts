/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { MenuItemLocation } from 'api/types';

/** setupMenu ***************************************************************************************************************************************
 * Sets up the menu used by the plugin                                                                                                              *
 ***************************************************************************************************************************************************/
export async function setupMenu(){
    await joplin.views.menus.create(
        'recurrenceMenu', 
        "Repeating Todos", 
        [
            {commandName: 'updateAllRecurrences'},
            {commandName: 'updateOverdueTodos'}
        ],
        MenuItemLocation.Tools
    )
}

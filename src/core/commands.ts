/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { openRecurrenceDialog, updateAllRecurrences, updateOverdueTodos } from "./recurrence";

/** setupCommands ***********************************************************************************************************************************
 * Sets up all commands used by toolbar buttons and menu items                                                                                      *
 ***************************************************************************************************************************************************/
export async function setupCommands(){
    await joplin.commands.register({
        name: 'updateAllRecurrences',
        label: 'Update All Recurrence Information',
        iconName: 'fas fa-redo-alt',
        execute: updateAllRecurrences
    })
    await joplin.commands.register({
        name: 'updateOverdueTodos',
        label: 'Update Overdue To-Dos',
        iconName: 'fas fa-redo-alt',
        execute: updateOverdueTodos
    })
    await joplin.commands.register({
        name: 'openRecurrenceDialog',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: openRecurrenceDialog
    })
}
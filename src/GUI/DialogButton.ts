/* Imports ***************************************************************************************/
import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';
import { onRecurrenceDialogButtonClicked } from '../Logic/core'

/* setupDialogButton ******************************************************************************
    Sets up the button on the toolbar that opens the recurrence dialog
*/
export async function setupDialogButton(){
    await joplin.commands.register({                            // Register the open recurrence dialog command
        name: 'openRecurrenceDialog',                           // Set the name of the command
        label: 'Open Recurrence Dialog',                        // Set the label for the command
        iconName: 'fas fa-redo-alt',                            // Set the icon for the command
        execute: async () => {onRecurrenceDialogButtonClicked();},
    });
    await joplin.views.toolbarButtons.create(                   // Creat the open dialog button and bind it to the command
        'openRecurrenceDialogButton',                           // The name of the button
        'openRecurrenceDialog',                                 // The above command to bind the button to
        ToolbarButtonLocation.NoteToolbar                       // The location of the new button (on the note toolbar)
    );
}

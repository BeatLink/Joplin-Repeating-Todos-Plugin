/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';
import { openRecurrenceDialog } from '../Logic/core';

/** setupDialogButton *******************************************************************************************************************************
 * Sets up the button on the toolbar that opens the recurrence dialog                                                                               *
 ***************************************************************************************************************************************************/
export async function setupDialogButton(){
    await joplin.commands.register({
        name: 'openRecurrenceDialog',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: async () => {
            openRecurrenceDialog();
        },
    });
    await joplin.views.toolbarButtons.create(
        'openRecurrenceDialogButton',
        'openRecurrenceDialog',
        ToolbarButtonLocation.NoteToolbar
    );
}


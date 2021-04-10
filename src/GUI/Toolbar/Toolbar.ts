import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';


export async function setupToolbar(dialogHandle:string, dialogClosedFunction:Function){
    /*
        Sets up the button on the toolbar that opens the recurrence dialog
    */
    await joplin.commands.register({
        name: 'editRecurrence',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: async () => {
            const result = await joplin.views.dialogs.open(dialogHandle);
            dialogClosedFunction(result);
        },
    });
    await joplin.views.toolbarButtons.create('editRecurrenceButton', 'editRecurrence', ToolbarButtonLocation.NoteToolbar);
}


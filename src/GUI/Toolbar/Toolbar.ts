import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';


export async function setupToolbar(buttonClickedCallback:Function){
    /*
        Sets up the button on the toolbar that opens the recurrence dialog
    */
    await joplin.commands.register({
        name: 'editRecurrence',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: async () => {
            buttonClickedCallback();
        },
    });
    await joplin.views.toolbarButtons.create('editRecurrenceButton', 'editRecurrence', ToolbarButtonLocation.NoteToolbar);
}


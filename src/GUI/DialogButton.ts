// Imports ########################################################################################
import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';
import { openRecurrenceDialog} from './Dialog/Dialog';

// SetupDialotButton ##############################################################################
/*
    Sets up the button on the toolbar that opens the recurrence dialog
*/
export async function setupDialogButton(){
    await joplin.commands.register({
        name: 'editRecurrence',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: async () => {openRecurrenceDialog();},
    });
    await joplin.views.toolbarButtons.create(
        'editRecurrenceButton', 
        'editRecurrence', 
        ToolbarButtonLocation.NoteToolbar
    );
}


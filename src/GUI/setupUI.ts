import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';

async function createDialog(){
    const Dialog = await joplin.views.dialogs.create('Dialog');
    const DialogHTML = await require('./Dialog/Dialog.html').default;
    await joplin.views.dialogs.setHtml(Dialog, DialogHTML);
    await joplin.views.dialogs.addScript(Dialog, './GUI/Dialog/Dialog.js')
    await joplin.views.dialogs.addScript(Dialog, './GUI/Dialog/Dialog.css')
    return Dialog;
}

async function setupToolbar(){
    var Dialog = await createDialog();
    await joplin.commands.register({
        name: 'editRecurrence',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: async () => {
            const result = await joplin.views.dialogs.open(Dialog);
            console.info('Got result: ' + JSON.stringify(result));				
        },
    });
    await joplin.views.toolbarButtons.create('editRecurrenceButton', 'editRecurrence', ToolbarButtonLocation.NoteToolbar);
}

export async function setupGUI(){
    await setupToolbar();
}
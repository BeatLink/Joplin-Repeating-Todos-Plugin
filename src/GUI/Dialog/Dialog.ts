// Imports ########################################################################################
import joplin from 'api';
import { Recurrence } from '../../Logic/recurrence';

export async function createDialog(){
    const dialog = await joplin.views.dialogs.create('Dialog');
    await joplin.views.dialogs.addScript(dialog, './GUI/Dialog/Dialog.js')
    await joplin.views.dialogs.addScript(dialog, './GUI/Dialog/Dialog.css')
    return dialog;
}

export async function openDialog(dialog, recurrenceData){
    await setRecurrence(dialog, recurrenceData)                          // load recurrence into dialog
    var formResult = await joplin.views.dialogs.open(dialog);             // Show Dialog
    return await getRecurrence(formResult)
}

async function setRecurrence(dialogHandle, recurrenceData:Recurrence){
    const DialogHTML = await require('./Dialog.html').default;
    var replacedHTML = DialogHTML.replace("RECURRENCE_DATA", btoa(recurrenceData.toJSON()))
    await joplin.views.dialogs.setHtml(dialogHandle, replacedHTML);
}

async function getRecurrence(formResult){
    if (formResult.id == 'ok') {
        var encodedRecurrenceData = formResult.formData.recurrenceForm.recurrenceData                   // gets the encoded recurrence data from the hidden form
        var decodedRecurrenceData = atob(encodedRecurrenceData)             // decodes the recurrence data into the json string
        var recurrence = new Recurrence()
        recurrence.fromJSON(decodedRecurrenceData)
        return recurrence
    }
}

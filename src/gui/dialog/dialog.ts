/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { recurrenceFromJSON, recurrenceToJSON } from '../../model/recurrence';
const fs = joplin.require('fs-extra');

var dialog = null;
var HTMLFilePath = null;
var BaseHTML = null


/** createDialog ************************************************************************************************************************************
 * Initializes the recurrence dialog                                                                                                                *
 ***************************************************************************************************************************************************/
export async function setupDialog(){
    HTMLFilePath = (await joplin.plugins.installationDir()) + "/gui/dialog/dialog.html"
    BaseHTML = await fs.readFile(HTMLFilePath, 'utf8');
    dialog = await joplin.views.dialogs.create('dialog');
    await joplin.views.dialogs.addScript(dialog, './gui/dialog/dialog.js')
    await joplin.views.dialogs.addScript(dialog, './gui/dialog/dialog.css')
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openDialog(recurrenceData){
    var replacedHTML = BaseHTML.replace("RECURRENCE_DATA", btoa(recurrenceToJSON(recurrenceData)))
    await joplin.views.dialogs.setHtml(dialog, replacedHTML);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        return recurrenceFromJSON(atob(formResult.formData.recurrenceForm.recurrenceData))
    }
}


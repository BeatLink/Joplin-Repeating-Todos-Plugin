/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { Recurrence} from '../../logic/recurrence';


var dialog = null;


/** createDialog ************************************************************************************************************************************
 * Initializes the recurrence dialog                                                                                                                *
 ***************************************************************************************************************************************************/
export async function createDialog(){
    dialog = await joplin.views.dialogs.create('Dialog');
    await joplin.views.dialogs.addScript(dialog, './gui/Dialog/Dialog.js')
    await joplin.views.dialogs.addScript(dialog, './gui/Dialog/Dialog.css')
}


/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openDialog(recurrenceData){
    const DialogHTML = await require('./Dialog.html').default;
    var replacedHTML = DialogHTML.replace("RECURRENCE_DATA", btoa(recurrenceToJSON(recurrenceData)))
    await joplin.views.dialogs.setHtml(dialog, replacedHTML);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        return recurrenceFromJSON(atob(formResult.formData.recurrenceForm.recurrenceData))
    }

}


/** recurrenceToJSON ********************************************************************************************************************************
 * Save recurrence data as a json string                                                                                                            *
 ***************************************************************************************************************************************************/
function recurrenceToJSON(recurrence){
    return JSON.stringify({
        enabled: recurrence.enabled,
        interval: recurrence.interval,
        intervalNumber: recurrence.intervalNumber,
        weekSunday: recurrence.weekSunday,
        weekMonday: recurrence.weekMonday,
        weekTuesday: recurrence.weekTuesday,
        weekWednesday: recurrence.weekWednesday,
        weekThursday: recurrence.weekThursday,
        weekFriday: recurrence.weekFriday,
        weekSaturday: recurrence.weekSaturday,
        monthOrdinal: recurrence.monthOrdinal,
        monthWeekday: recurrence.monthWeekday,
        stopType: recurrence.stopType,
        stopDate: recurrence.stopDate,
        stopNumber: recurrence.stopNumber,
    })
}


/** recurrenceFromJSON **************************************************************************************************************************
 * Loads Recurrence data from a JSON string                                                                                                     *
 ***********************************************************************************************************************************************/
function recurrenceFromJSON(JSONstring){
    var parsedJSON = JSON.parse(JSONstring)
    var recurrence = new Recurrence()
    recurrence.enabled = Boolean(parsedJSON.enabled)
    recurrence.intervalNumber = Number(parsedJSON.intervalNumber)
    recurrence.interval = String(parsedJSON.interval)
    recurrence.weekSunday = Boolean(parsedJSON.weekSunday)
    recurrence.weekMonday = Boolean(parsedJSON.weekMonday)
    recurrence.weekTuesday = Boolean(parsedJSON.weekTuesday)
    recurrence.weekWednesday = Boolean(parsedJSON.weekWednesday)
    recurrence.weekThursday = Boolean(parsedJSON.weekThursday)
    recurrence.weekFriday = Boolean(parsedJSON.weekFriday)
    recurrence.weekSaturday = Boolean(parsedJSON.weekSaturday)
    recurrence.monthOrdinal = String(parsedJSON.monthOrdinal)
    recurrence.monthWeekday = String(parsedJSON.monthWeekday)
    recurrence.stopType = String(parsedJSON.stopType)
    recurrence.stopDate = String(parsedJSON.stopDate)
    recurrence.stopNumber = Number(parsedJSON.stopNumber)
    return recurrence
}
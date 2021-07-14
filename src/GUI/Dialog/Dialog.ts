// Imports ########################################################################################
import joplin from 'api';
import { DialogResult } from 'api/types';
import { Recurrence } from '../../Logic/recurrence';

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');
const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');

export async function createDialog(){
    const dialog = await joplin.views.dialogs.create('Dialog');
    await joplin.views.dialogs.addScript(dialog, './GUI/Dialog/Dialog.js')
    await joplin.views.dialogs.addScript(dialog, './GUI/Dialog/Dialog.css')
    return dialog;
}

export async function openDialog(dialog){
    return await joplin.views.dialogs.open(dialog);             // Show Dialog
}

export async function setRecurrence(dialogHandle, recurrenceData:Recurrence){
    const DialogHTML = await require('./Dialog.html').default;

    

    var replacedHTML = DialogHTML.replace("RECURRENCE_DATA", btoa(recurrenceData.toJSON()))
    await joplin.views.dialogs.setHtml(dialogHandle, replacedHTML);
}

export async function getRecurrence(recurrenceFormData){
    var newRecurrenceData = recurrenceFormData.formData.recurrence;    
    var recurrence = new Recurrence();
    recurrence.enabled = ('Enabled' in newRecurrenceData ? true : false);    
    recurrence.intervalNumber = Number(newRecurrenceData.IntervalNumber);
    recurrence.interval = newRecurrenceData.Interval;
    recurrence.weekSunday = ('weekdaySunday' in newRecurrenceData ? true : false);
    recurrence.weekMonday = ('weekdayMonday' in newRecurrenceData ? true : false);
    recurrence.weekTuesday = ('weekdayTuesday' in newRecurrenceData ? true : false);
    recurrence.weekWednesday = ('weekdayWednesday' in newRecurrenceData ? true : false);
    recurrence.weekThursday = ('weekdayThursday' in newRecurrenceData ? true : false);
    recurrence.weekFriday = ('weekdayFriday' in newRecurrenceData ? true : false);
    recurrence.weekSaturday = ('weekdaySaturday' in newRecurrenceData ? true : false);
    recurrence.monthOrdinal = newRecurrenceData.dayOfMonthOrdinal;
    recurrence.monthWeekday = newRecurrenceData.dayOfMonthWeekday;
    recurrence.stopType = newRecurrenceData.StopType;
    recurrence.stopDate = (newRecurrenceData.StopDate ? new Date(newRecurrenceData.StopDate) : null);
    recurrence.stopNumber = Number(newRecurrenceData.StopNumber);
    return recurrence;
}

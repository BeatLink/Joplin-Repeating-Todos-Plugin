// Imports ########################################################################################
import joplin from 'api';
import { DialogResult } from 'api/types';
import { Recurrence } from '../../Logic/recurrence';

export async function createDialog(){
    const Dialog = await joplin.views.dialogs.create('Dialog');
    await joplin.views.dialogs.addScript(Dialog, './GUI/Dialog/Dialog.js')
    await joplin.views.dialogs.addScript(Dialog, './GUI/Dialog/Dialog.css')
    return Dialog;
}

export async function openDialog(dialog){
    const result = await joplin.views.dialogs.open(dialog);             // Show Dialog
    return result
}

export async function setRecurrence(dialogHandle, recurrenceData:Recurrence){
    const DialogHTML = await require('./Dialog.html').default;
    var replacedHTML = DialogHTML.replace("RECURRENCE_DATA", "Weeble")
    console.log(DialogHTML)
    await joplin.views.dialogs.setHtml(dialogHandle, replacedHTML);
}

export async function getRecurrence(recurrenceFormData){
    var newRecurrenceData = recurrenceFormData.formData.recurrence;    
    var recurrence = new Recurrence();
    recurrence.enabled = ('Enabled' in newRecurrenceData ? true : false);    
    recurrence.intervalNumber = Number(newRecurrenceData.IntervalNumber);
    recurrence.interval = newRecurrenceData.Interval;
    recurrence.weekdays.sunday = ('weekdaySunday' in newRecurrenceData ? true : false);
    recurrence.weekdays.monday = ('weekdayMonday' in newRecurrenceData ? true : false);
    recurrence.weekdays.tuesday = ('weekdayTuesday' in newRecurrenceData ? true : false);
    recurrence.weekdays.wednesday = ('weekdayWednesday' in newRecurrenceData ? true : false);
    recurrence.weekdays.thursday = ('weekdayThursday' in newRecurrenceData ? true : false);
    recurrence.weekdays.friday = ('weekdayFriday' in newRecurrenceData ? true : false);
    recurrence.weekdays.saturday = ('weekdaySaturday' in newRecurrenceData ? true : false);
    recurrence.weekdayOfMonth.ordinal = newRecurrenceData.dayOfMonthOrdinal;
    recurrence.weekdayOfMonth.weekday = newRecurrenceData.dayOfMonthWeekday;
    recurrence.stopInfo.type = newRecurrenceData.StopType;
    recurrence.stopInfo.date = (newRecurrenceData.StopDate ? new Date(newRecurrenceData.StopDate) : null);
    recurrence.stopInfo.number = Number(newRecurrenceData.StopNumber);
    return recurrence;
}

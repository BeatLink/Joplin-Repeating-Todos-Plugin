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
    await joplin.views.dialogs.setHtml(dialogHandle, replacedHTML);
}

export async function getRecurrence(recurrenceFormData){
    var newRecurrenceData = recurrenceFormData.formData.recurrence;    
    var recurrence = new Recurrence();
    recurrence.enabled = ('Enabled' in newRecurrenceData ? true : false);    
    recurrence.intervalNumber = Number(newRecurrenceData.IntervalNumber);
    recurrence.interval = newRecurrenceData.Interval;
    recurrence.week_sunday = ('weekdaySunday' in newRecurrenceData ? true : false);
    recurrence.week_monday = ('weekdayMonday' in newRecurrenceData ? true : false);
    recurrence.week_tuesday = ('weekdayTuesday' in newRecurrenceData ? true : false);
    recurrence.week_wednesday = ('weekdayWednesday' in newRecurrenceData ? true : false);
    recurrence.week_thursday = ('weekdayThursday' in newRecurrenceData ? true : false);
    recurrence.week_friday = ('weekdayFriday' in newRecurrenceData ? true : false);
    recurrence.week_saturday = ('weekdaySaturday' in newRecurrenceData ? true : false);
    recurrence.month_ordinal = newRecurrenceData.dayOfMonthOrdinal;
    recurrence.month_weekday = newRecurrenceData.dayOfMonthWeekday;
    recurrence.stop_type = newRecurrenceData.StopType;
    recurrence.stop_date = (newRecurrenceData.StopDate ? new Date(newRecurrenceData.StopDate) : null);
    recurrence.stop_number = Number(newRecurrenceData.StopNumber);
    return recurrence;
}

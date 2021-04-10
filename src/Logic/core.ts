import { DialogResult } from 'api/types';
import { createDialog } from '../GUI/Dialog/Dialog';
import { setupToolbar } from '../GUI/Toolbar/Toolbar';
import { Recurrence } from './recurrence';


//import { setupDatabase } from '../Archive/Database/database';

// GUI ############################################################################################
async function getResults(result:DialogResult){
    if (result.id == 'cancel') {
        console.info('Dialog cancelled');
        return;
    }


    var recurrenceData = result.formData.recurrence;
    console.info('Got result: ' + JSON.stringify(recurrenceData));
    
    var recurrence = new Recurrence();
    
    recurrence.enabled = ('Enabled' in recurrenceData ? true : false);    
    recurrence.intervalNumber = recurrenceData.IntervalNumber;
    recurrence.interval = recurrenceData.Interval;
    recurrence.weekdays.sunday = ('weekdaySunday' in recurrenceData ? true : false);
    recurrence.weekdays.monday = ('weekdayMonday' in recurrenceData ? true : false);
    recurrence.weekdays.tuesday = ('weekdayTuesday' in recurrenceData ? true : false);
    recurrence.weekdays.wednesday = ('weekdayWednesday' in recurrenceData ? true : false);
    recurrence.weekdays.thursday = ('weekdayThursday' in recurrenceData ? true : false);
    recurrence.weekdays.friday = ('weekdayFriday' in recurrenceData ? true : false);
    recurrence.weekdays.saturday = ('weekdaySaturday' in recurrenceData ? true : false);
    recurrence.weekdayOfMonth.ordinal = recurrenceData.dayOfMonthOrdinal;
    recurrence.weekdayOfMonth.weekday = recurrenceData.dayOfMonthWeekday;
    
    console.debug(recurrence.interval);
    console.debug(recurrence.weekdays)
    console.debug(recurrence.enabled);
    console.debug(recurrence.intervalNumber);



    console.log(recurrence.enabled)

    /*Got result: 
    {
        "id":"ok",
        "formData": {
            "recurrence":{
                "Enabled":"True",
                "IntervalNumber":"6",
                "Interval":"week",

                "weekdayMonday":"true",
                "weekdayThursday":"true",
                
                "dayOfMonthOrdinal":"first",
                "dayOfMonthWeekday":"sunday",
                "StopDropdown":"number",
                "StopNumber":"1",
                "StopDate":""}}}
    */

}
    
async function setupGUI(){
    await setupToolbar(await createDialog(), getResults);
}


// Main ###########################################################################################
export async function main() {

    //Log startup to console
    await console.info('Repeating To-Dos Plugin started!');

    //Setup UI
    await setupGUI();

}



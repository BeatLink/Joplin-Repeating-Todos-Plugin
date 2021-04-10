import { DialogResult } from 'api/types';
import { createDialog } from '../GUI/Dialog/Dialog';
import { setupToolbar } from '../GUI/Toolbar/Toolbar';
import { Recurrence } from './recurrence';


//import { setupDatabase } from '../Archive/Database/database';

// GUI ############################################################################################
async function getResults(result:DialogResult){
    console.info('Got result: ' + JSON.stringify(result));
    
    var recurrenceData = result.formData.recurrence
    var recurrence = new Recurrence();
    recurrence.enabled = recurrenceData.Enabled;
    recurrence.intervalNumber = recurrenceData.intervalNumber;
    recurrence.interval = recurrenceData.Interval;

    if ('weekdayMonday' in recurrenceData){
        null;
    } 


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



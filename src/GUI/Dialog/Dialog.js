/******************************************************************************************************************************************
************************************************ Recurrence Data Management ***************************************************************
******************************************************************************************************************************************/

var recurrenceInput = document.getElementById('recurrenceDataInput')    // Gets the hidden input storing the recurrence data
var recurrence = null;                                                  // Initializes the recurrence object
loadData();                                                             // Loads the data into the recurrence object on dialog opening

/* loadData *******************************************************************************************************************************
    Loads data from the hidden data form into the dialog recurrence object
*/
function loadData(){
    var encodedRecurrenceData = recurrenceInput.value                   // gets the encoded recurrence data from the hidden form
    var decodedRecurrenceData = atob(encodedRecurrenceData)             // decodes the recurrence data into the json string
    recurrence = JSON.parse(decodedRecurrenceData)                      // parse the recurrence json string into a usable data object
}

/* saveData *******************************************************************************************************************************
    Saves data from the dialog recurrence object into the hidden data form
*/
function saveData(){
    var JSONstring = JSON.stringify(recurrence)                         // Saves the recurrence data object to a json string
    var encodedString = btoa(JSONstring)                                // Encodes the json string to make it safe for HTML insertion
    recurrenceInput.value = encodedString                               // saves the encoded string to the hidden recurrence data form
}

/******************************************************************************************************************************************
************************************************************* Stop Data *******************************************************************
******************************************************************************************************************************************/
let stopFieldset = document.getElementById('stopFieldset');
let stopTypeDropdown = document.getElementById('stopTypeDropdown');
let stopNumberSpinbutton = document.getElementById('stopNumberSpinbutton');
let stopDatePicker = document.getElementById('stopDatePicker');

stopTypeDropdown.addEventListener("change", onStopTypeChanged);
stopNumberSpinbutton.addEventListener("change", onStopNumberChanged);
stopDatePicker.addEventListener("change", onStopDateChanged);

function onStopTypeChanged(){
    recurrence.stopType = stopTypeDropdown.value
    if (recurrence.enabled && recurrence.stopType == 'date') {
        stopDatePicker.style.display='block';
    } else {
        stopDatePicker.style.display='none'
    }
    if (recurrence.enabled && recurrence.stopType == 'number') {
        stopNumberSpinbutton.style.display='block';
    } else {
        stopNumberSpinbutton.style.display='none'
    }
    saveData()
}

function onStopNumberChanged(){
    recurrence.stopNumber = stopNumberSpinbutton.value
    saveData()
}

function onStopDateChanged(){
    recurrence.stopDate = stopDatePicker.value
    saveData()
}


/******************************************************************************************************************************************
************************************************************* Month Weekday ***************************************************************
*****************************************************************************************************************************************/
let monthWeekdayFieldset = document.getElementById('monthWeekdayFieldset');
let monthOrdinalDropdown = document.getElementById('monthOrdinalDropdown');
let monthWeekdayDropdown = document.getElementById('monthWeekdayDropdown');

monthWeekdayDropdown.addEventListener('change', onMonthWeekdayChanged);
monthOrdinalDropdown.addEventListener('change', onMonthOrdinalChanged)

function onMonthWeekdayChanged(){
    recurrence.monthWeekday = monthWeekdayDropdown.value
    if (recurrence.enabled && recurrence.interval == "month" && recurrence.monthWeekday != '') {
        monthOrdinalDropdown.style.display = 'inline';
    } else {
        monthOrdinalDropdown.style.display = 'none';
    }
    saveData()
}

function onMonthOrdinalChanged(){
    recurrence.monthOrdinal = monthOrdinalDropdown.value
    saveData()
}



/*******************************************************************************************************************************************
****************************************************************** Week ********************************************************************
*******************************************************************************************************************************************/
let WeekdaysFieldset = document.getElementById('weekdaysFieldset');
let weekSundayCheckbox = document.getElementById('weekdaySundayCheckbox')
let weekMondayCheckbox = document.getElementById('weekdayMondayCheckbox')
let weekTuesdayCheckbox = document.getElementById('weekdayTuesdayCheckbox')
let weekWednesdayCheckbox = document.getElementById('weekdayWednesdayCheckbox')
let weekThursdayCheckbox = document.getElementById('weekdayThursdayCheckbox')
let weekFridayCheckbox = document.getElementById('weekdayFridayCheckbox')
let weekSaturdayCheckbox = document.getElementById('weekdaySaturdayCheckbox')
weekSundayCheckbox.addEventListener("change", onWeekSundayCheckboxChanged);
weekMondayCheckbox.addEventListener("change", onWeekMondayCheckboxChanged);
weekTuesdayCheckbox.addEventListener("change", onWeekTuesdayCheckboxChanged);
weekWednesdayCheckbox.addEventListener("change", onWeekWednesdayCheckboxChanged);
weekThursdayCheckbox.addEventListener("change", onWeekThursdayCheckboxChanged);
weekFridayCheckbox.addEventListener("change", onWeekFridayCheckboxChanged);
weekSaturdayCheckbox.addEventListener("change", onWeekSaturdayCheckboxChanged);

function onWeekSundayCheckboxChanged(){
    recurrence.weekSunday = weekSundayCheckbox.checked
    saveData()
}
function onWeekMondayCheckboxChanged(){
    recurrence.weekMonday = weekMondayCheckbox.checked
    saveData()
}
function onWeekTuesdayCheckboxChanged(){
    recurrence.weekTuesday = weekTuesdayCheckbox.checked
    saveData()
}
function onWeekWednesdayCheckboxChanged(){
    recurrence.weekWednesday = weekWednesdayCheckbox.checked
    saveData()
}
function onWeekThursdayCheckboxChanged(){
    recurrence.weekThursday = weekThursdayCheckbox.checked
    saveData()
}
function onWeekFridayCheckboxChanged(){
    recurrence.weekFriday = weekFridayCheckbox.checked
    saveData()
}
function onWeekSaturdayCheckboxChanged(){
    recurrence.weekSaturday = weekSaturdayCheckbox.checked
    saveData()
}




/******************************************************************************************************************************************
***************************************************************** Interval **************************************************************** 
******************************************************************************************************************************************/

let intervalFieldset = document.getElementById('intervalFieldset');     // Gets the interval Fieldset
let intervalNumberSpinbutton = document.getElementById('intervalNumberSpinbutton')  // Gets the interval number spinbutton
let intervalDropdown = document.getElementById('intervalDropdown');     // Gets the interval dropdown
intervalDropdown.addEventListener("change", onIntervalChanged);
intervalNumberSpinbutton.addEventListener("change", onIntervalNumberChanged);

/* onIntervalChanged **********************************************************************************************************************
    Called if thee interval dropdown changes. It saves the changes to the hidden form and toggles the visibility of the other elements
    depending on the current interval
*/
function onIntervalChanged(){
    recurrence.interval = intervalDropdown.value
    if (recurrence.enabled && recurrence.interval == "week") {
        WeekdaysFieldset.style.display = 'block';
    } else {
        WeekdaysFieldset.style.display = 'none';
    }
    if (recurrence.enabled && recurrence.interval == "month") {
        monthWeekdayFieldset.style.display='block'
    } else {
        monthWeekdayFieldset.style.display='none';
    }
    onMonthWeekdayChanged();
    saveData()
}

/* onIntervalNumberChanged ****************************************************************************************************************
    Called when the interval number spinbutton changes. Saves the changes to the hidden form
*/
function onIntervalNumberChanged(){
    recurrence.intervalNumber = intervalNumberSpinbutton.value
    saveData()
}


/******************************************************************************************************************************************
 ***************************************************************** Enabled ****************************************************************
******************************************************************************************************************************************/
let enabledCheckbox = document.getElementById('enabledCheckbox');       // Gets the enabled checkbox
enabledCheckbox.addEventListener("change", onEnabledChanged);           // Adds callback for when the checbox is ticked

/* onEnabledChanged ***********************************************************************************************************************
    Called if the enabled checkbox is toggled. It saves the changes to the hidden form and toggles the visibility of the other elements
    depending on the enabled state
*/

function onEnabledChanged(){
    recurrence.enabled = enabledCheckbox.checked                        // Saves the checkbox status to the recurrence object
    if (recurrence.enabled) {                                           // If the recurrence is enabled
        intervalFieldset.style.display='block';                         // Show the interval Fieldset...
        stopFieldset.style.display='block';                             // and the stop Fieldset
    } else {                                                            // Otherwise...
        intervalFieldset.style.display='none';                          // Hide the interval Fieldset
        stopFieldset.style.display='none';                              // And the stop Fieldset
    }
    onIntervalChanged();                                                // Calls the interval changed function for updating
    onStopType();                                                       // Calls the stop type changed function for updating
    saveData()                                                          // Saves the data to the hidden form
}

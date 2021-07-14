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
    var JSONstring = recurrence.toJSON()                                // Saves the recurrence data object to a json string
    var encodedString = btoa(JSONstring)                                // Encodes the json string to make it safe for HTML insertion
    recurrenceInput.value = encodedString                               // saves the encoded string to the hidden recurrence data form
}

/******************************************************************************************************************************************
 ******************************************************* Enabled **************************************************************************
******************************************************************************************************************************************/

let enabledCheckbox = document.getElementById('EnabledCheckbox');       // Gets the enabled checkbox
enabledCheckbox.addEventListener("change", onEnabledChanged);           // Adds callback for when the checbox is ticked


/* onEnabledChanged ***********************************************************************************************************************
    Called if the enabled checkbox is toggled. It saves the changes to the hidden form and toggles the visibility of the other elements
    depending on the enabled state
*/

function onEnabledChanged(){
    recurrence.enabled = enabledCheckbox.checked                        // Saves the checkbox status to the recurrence object
    if (recurrence.enabled) {                                           // If the recurrence is enabled
        intervalSection.style.display='block';                          // Show the interval section...
        stopSection.style.display='block';                              // and the stop Section
    } else {                                                            // Otherwise...
        intervalSection.style.display='none';                           // Hide the interval section
        stopSection.style.display='none';                               // And the stop section
    }
    onIntervalChanged();                                                // Calls the interval changed function for updating
    onStopChanged();                                                    // Calls the stop changed function for updating
    saveData()
}


/*******************************************************************************************************************************************************
 Interval 
 *******************************************************************************************************************************************************/
 let intervalSection = document.getElementById('IntervalSection');
 let IntervalDropdown = document.getElementById('IntervalDropdown');
 
 IntervalDropdown.addEventListener("change", onIntervalChanged);


function onIntervalChanged(){
    recurrence.interval = IntervalDropdown.value
    if (recurrence.enabled && recurrence.interval == "week") {
        WeekdaysSection.style.display = 'block';
    } else {
        WeekdaysSection.style.display = 'none';
    }
    if (recurrence.enabled && recurrence.interval == "month") {
        DayOfMonthSection.style.display='block'
    } else {
        DayOfMonthSection.style.display='none';
    }
    onDayOfMonthChanged();
    saveData()
}


/******************************************************************************************************************************************
 Interval Number
******************************************************************************************************************************************/

intervalNumber: 1
//on interval number changes



/*******************************************************************************************************************************************
 Week
*******************************************************************************************************************************************/
let WeekdaysSection = document.getElementById('WeekdaysSection');
let weekSunday = document.getElementById('weekdaySundayCheckbox')
let weekMonday = document.getElementById('weekdayMondayCheckbox')
let weekTuesday = document.getElementById('weekdayTuesdayCheckbox')
let weekWednesday = document.getElementById('weekdayWednesdayCheckbox')
let weekThursday = document.getElementById('weekdayThursdayCheckbox')
let weekFriday = document.getElementById('weekdayFridayCheckbox')
let weekSaturday = document.getElementById('weekdaySaturdayCheckbox')
weekFriday: false
weekMonday: false
weekSaturday: false
weekSunday: false
weekThursday: false
weekTuesday: false
weekWednesday: false




/******************************************************************************************************************************************
 Weekday of Month
 *****************************************************************************************************************************************/

 let DayOfMonthSection = document.getElementById('DayOfMonthSection');
 let DayOfMonthOrdinalDropdown = document.getElementById('DayOfMonthOrdinalDropdown');
 let DayOfMonthWeekdayDropdown = document.getElementById('DayOfMonthWeekdayDropdown');


monthOrdinal: ""
monthWeekday: ""

 DayOfMonthWeekdayDropdown.addEventListener('change', onDayOfMonthChanged);

function onDayOfMonthChanged(){
    if (enabledCheckbox.checked && IntervalDropdown.value == "month" && DayOfMonthWeekdayDropdown.value) {
        DayOfMonthOrdinalDropdown.style.display = 'inline';
    } else {
        DayOfMonthOrdinalDropdown.style.display = 'none';
    }
}


/******************************************************************************************************************************************
 Stop Data
 */


 let stopSection = document.getElementById('StopSection');
 let StopDropdown = document.getElementById('StopDropdown');
 let StopNumber = document.getElementById('StopNumber');
 let StopDate = document.getElementById('StopDate');



 stopDate: null
 stopNumber: 1
 stopType: "never"



StopDropdown.addEventListener("change", onStopChanged);


 
 
function onStopChanged(){
    if (enabledCheckbox.checked && StopDropdown.value == 'date') {
        StopDate.style.display='block';
    } else {
        StopDate.style.display='none'
    }

    if (enabledCheckbox.checked && StopDropdown.value == 'number') {
        StopNumber.style.display='block';
    } else {
        StopNumber.style.display='none'
    }
}



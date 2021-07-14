let EnabledCheckbox = document.getElementById('EnabledCheckbox');
let IntervalSection = document.getElementById('IntervalSection');
let IntervalDropdown = document.getElementById('IntervalDropdown');
let WeekdaysSection = document.getElementById('WeekdaysSection');
let weekSunday = document.getElementById('weekdaySundayCheckbox')
let weekMonday = document.getElementById('weekdayMondayCheckbox')
let weekTuesday = document.getElementById('weekdayTuesdayCheckbox')
let weekWednesday = document.getElementById('weekdayWednesdayCheckbox')
let weekThursday = document.getElementById('weekdayThursdayCheckbox')
let weekFriday = document.getElementById('weekdayFridayCheckbox')
let weekSaturday = document.getElementById('weekdaySaturdayCheckbox')
let DayOfMonthSection = document.getElementById('DayOfMonthSection');
let DayOfMonthOrdinalDropdown = document.getElementById('DayOfMonthOrdinalDropdown');
let DayOfMonthWeekdayDropdown = document.getElementById('DayOfMonthWeekdayDropdown');
let StopSection = document.getElementById('StopSection');
let StopDropdown = document.getElementById('StopDropdown');
let StopNumber = document.getElementById('StopNumber');
let StopDate = document.getElementById('StopDate');

/***************************************************************************************************************************************
Recurrence Data Management 
*****************************************************************************************************************************************/
let RecurrenceDataField = document.getElementById('RecurrenceData')

var recurrence = null;
loadData();

function loadData(){
    recurrence = JSON.parse(atob(RecurrenceDataField.value))
}

function saveData(){
    RecurrenceDataField.value = btoa(recurrence.toJSON())
}


/******************************************************************************************************************************************
 * Enabled Controls 

















function onEnabledChanged(){
    recurrence.enabled = EnabledCheckbox.checked
    if (recurrence.enabled) {
        IntervalSection.style.display='block';
        StopSection.style.display='block';
    } else {
        IntervalSection.style.display='none';
        StopSection.style.display='none';
    }
    onIntervalChanged();
    onStopChanged();
    saveData()
}

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




weekFriday: false
weekMonday: false
weekSaturday: false
weekSunday: false
weekThursday: false
weekTuesday: false
weekWednesday: false


function onStopChanged(){
    if (EnabledCheckbox.checked && StopDropdown.value == 'date') {
        StopDate.style.display='block';
    } else {
        StopDate.style.display='none'
    }

    if (EnabledCheckbox.checked && StopDropdown.value == 'number') {
        StopNumber.style.display='block';
    } else {
        StopNumber.style.display='none'
    }
}

function onDayOfMonthChanged(){
    if (EnabledCheckbox.checked && IntervalDropdown.value == "month" && DayOfMonthWeekdayDropdown.value) {
        DayOfMonthOrdinalDropdown.style.display = 'inline';
    } else {
        DayOfMonthOrdinalDropdown.style.display = 'none';
    }
}






EnabledCheckbox.addEventListener("change", onEnabledChanged); 
IntervalDropdown.addEventListener("change", onIntervalChanged);
StopDropdown.addEventListener("change", onStopChanged);
DayOfMonthWeekdayDropdown.addEventListener('change', onDayOfMonthChanged);



intervalNumber: 1
monthOrdinal: ""
monthWeekday: ""
stopDate: null
stopNumber: 1
stopType: "never"



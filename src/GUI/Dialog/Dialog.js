let EnabledCheckbox = document.getElementById('EnabledCheckbox');
let IntervalSection = document.getElementById('IntervalSection');
let IntervalDropdown = document.getElementById('IntervalDropdown');
let WeekdaysSection = document.getElementById('WeekdaysSection');
let DayOfMonthSection = document.getElementById('DayOfMonthSection');
let DayOfMonthOrdinalDropdown = document.getElementById('DayOfMonthOrdinalDropdown');
let DayOfMonthWeekdayDropdown = document.getElementById('DayOfMonthWeekdayDropdown');
let StopSection = document.getElementById('StopSection');
let StopDropdown = document.getElementById('StopDropdown');
let StopNumber = document.getElementById('StopNumber');
let StopDate = document.getElementById('StopDate');


console.log(document.getElementById('RecurrenceData'))

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

function onIntervalChanged(){
    console.log(" Interval Changed" + IntervalDropdown.value);

    if (EnabledCheckbox.checked && IntervalDropdown.value == "week") {
        WeekdaysSection.style.display = 'block';
    } else {
        WeekdaysSection.style.display = 'none';
    }

    if (EnabledCheckbox.checked && IntervalDropdown.value == "month") {
        DayOfMonthSection.style.display='block'
    } else {
        DayOfMonthSection.style.display='none';
    }
    onDayOfMonthChanged();
}

function onEnabledChanged(){
    console.log(" Enabled Changed: " + EnabledCheckbox.checked);
    if (EnabledCheckbox.checked) {
        IntervalSection.style.display='block';
        StopSection.style.display='block';
    } else {
        IntervalSection.style.display='none';
        StopSection.style.display='none';
    }
    onIntervalChanged();
    onStopChanged();
}


EnabledCheckbox.addEventListener("change", onEnabledChanged); 
IntervalDropdown.addEventListener("change", onIntervalChanged);
StopDropdown.addEventListener("change", onStopChanged);
DayOfMonthWeekdayDropdown.addEventListener('change', onDayOfMonthChanged);

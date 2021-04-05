let EnabledCheckbox = document.getElementById('EnabledCheckbox');
let IntervalSection = document.getElementById('IntervalSection');
let IntervalDropdown = document.getElementById('IntervalDropdown');
let WeekdaysSection = document.getElementById('WeekdaysSection');
let DayOfMonthSection = document.getElementById('DayOfMonthSection');
let RepeatStopSection = document.getElementById('RepeatStopSection');

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

}

function onEnabledChanged(){
    console.log(" Enabled Changed: " + EnabledCheckbox.checked);
    if (EnabledCheckbox.checked) {
        IntervalSection.style.display='block';
        RepeatStopSection.style.display='block'
    } else {
        IntervalSection.style.display='none';
        RepeatStopSection.style.display='none';
    }
    onIntervalChanged();
}


EnabledCheckbox.addEventListener("change", onEnabledChanged); 
IntervalDropdown.addEventListener("change", onIntervalChanged);

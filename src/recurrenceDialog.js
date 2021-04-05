let recurrenceEnabledCheckbox = document.getElementById('recurrenceEnabledCheckbox');
let recurrenceIntervalSection = document.getElementById('recurrenceIntervalSection');
let recurrenceIntervalDropdown = document.getElementById('recurrenceIntervalDropdown');
let recurrenceWeekdaysSection = document.getElementById('recurrenceWeekdaysSection');



function onRecurrenceIntervalChanged(){
    console.log("Recurrence Interval Changed" + recurrenceIntervalDropdown.value);
    if (recurrenceEnabledCheckbox.checked && recurrenceIntervalDropdown.value == "week") {
        console.log('show')
        recurrenceWeekdaysSection.style.display = 'block';
    } else {
        recurrenceWeekdaysSection.style.display = 'none';
    }

}

function onRecurrenceEnabledChanged(){
    console.log("Recurrence Enabled Changed: " + recurrenceEnabledCheckbox.checked);
    if (recurrenceEnabledCheckbox.checked) {
        recurrenceIntervalSection.style.display='block';
    } else {
        recurrenceIntervalSection.style.display='none';
    }
    onRecurrenceIntervalChanged();
}


recurrenceEnabledCheckbox.addEventListener("change", onRecurrenceEnabledChanged); 
recurrenceIntervalDropdown.addEventListener("change", onRecurrenceIntervalChanged);

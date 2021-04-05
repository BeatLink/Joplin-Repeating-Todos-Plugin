let EnabledCheckbox = document.getElementById('EnabledCheckbox');
let IntervalSection = document.getElementById('IntervalSection');
let IntervalDropdown = document.getElementById('IntervalDropdown');
let WeekdaysSection = document.getElementById('WeekdaysSection');



function onIntervalChanged(){
    console.log(" Interval Changed" + IntervalDropdown.value);
    if (EnabledCheckbox.checked && IntervalDropdown.value == "week") {
        console.log('show')
        WeekdaysSection.style.display = 'block';
    } else {
        WeekdaysSection.style.display = 'none';
    }

}

function onEnabledChanged(){
    console.log(" Enabled Changed: " + EnabledCheckbox.checked);
    if (EnabledCheckbox.checked) {
        IntervalSection.style.display='block';
    } else {
        IntervalSection.style.display='none';
    }
    onIntervalChanged();
}


EnabledCheckbox.addEventListener("change", onEnabledChanged); 
IntervalDropdown.addEventListener("change", onIntervalChanged);

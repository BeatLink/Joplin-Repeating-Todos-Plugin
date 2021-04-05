

let recurrenceEnabledCheckbox = document.getElementById('recurrenceEnabledCheckbox');
let recurrenceIntervalBr = document.getElementById('recurrenceIntervalBr');
let recurrenceIntervalFieldset = document.getElementById('recurrenceIntervalFieldset');


recurrenceIntervalFieldset.style.setProperty('display', 'none', '!important')


function onRecurrenceEnabledChanged(){
    console.log("Recurrence Enabled Changed");
    console.log(recurrenceEnabledCheckbox.checked);

    if (recurrenceEnabledCheckbox.checked) {
        recurrenceIntervalFieldset.style.display='block'
    } else {
        recurrenceIntervalFieldset.style.display='none'
    }
}

recurrenceEnabledCheckbox.addEventListener("change", onRecurrenceEnabledChanged); 

import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';

const recurrenceDialogHTML=`
<h1>Repeating To-Do</h1>
<form name="recurrence">
    <fieldset id=recurrenceEnabledFieldset> 
        <legend>Enabled</legend>
        <section>
        <input id="recurrenceEnabledCheckbox" type="checkbox" name="recurrenceEnabled" value="True">
        <label for="recurrenceEnabled">This Task Repeats</label></td>
        </section>
    </fieldset>
    </br class=hideByDefault id=recurrenceIntervalBr>
    <fieldset id=recurrenceIntervalFieldset class=hideByDefault>
        <legend>Interval</legend>
        <section>
        <input type="number" id="repeatPeriod" name="repeatPeriod" min="1" max="999" step="1" value="1">
        <select name="repeatInterval">
            <option value="minute" selected>Minute</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            </select>
            </section>
    </fieldset>
    </br class=hideByDefault>
    <fieldset id=recurrenceWeekdays class=hideByDefault>
        <legend>Weekdays</legend>
        <section>
        <table>
        <tr>
            <td><input type="checkbox" id="sunday" name="weekdaySunday" value="true"></td>
            <td><label for="sunday">Sunday</label></td>
        </tr>
        <tr>
            <td><input type="checkbox" id="monday" name="weekdayMonday" value="true"></td>
            <td><label for="monday">Monday</label></td>
        </tr>
        <tr>
            <td><input type="checkbox" id="tuesday" name="weekdayTuesday" value="true"></td>
            <td><label for="tuesday">Tuesday</label></td>
        </tr>
        <tr>
            <td><input type="checkbox" id="wednesday" name="weekdayWednesday" value="true"></td>
            <td><label for="wednesday">Wednesday</label></td>
        </tr>
        <tr>
            <td><input type="checkbox" id="thursday" name="weekdayThursday" value="true"></td>
            <td><label for="thursday">Thursday</label></td>
        </tr>
        <tr>
            <td><input type="checkbox" id="friday" name="weekdayFriday" value="true"></td>
            <td><label for="friday">Friday</label></td>
        </tr>
        <tr>
            <td><input type="checkbox" id="saturday" name="weekdaySaturday" value="true"></td>
            <td><label for="saturday">Saturday</label></td>
        </tr>
        </table>	
        </section>
    </fieldset>
    </br class=hideByDefault>
    <fieldset id=recurrenceDayofMonth class=hideByDefault>
        <legend>Day of Month</legend>
        <section>
        <select name="dayOfMonthOrdinal">
            <option value="first">First</option>
            <option value="second">Second</option>
            <option value="third">Third</option>
            <option value="fourth">Fourth</option>
            <option value="last">Last</option>
        </select>
        <select name="dayOfMonthWeekday">
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="thursday">Friday</option>
            <option value="thursday">Saturday</option>
        </select>
        </section>
    </fieldset>
    </br class=hideByDefault>
    <fieldset class=hideByDefault>
        <legend>Repeating Stops</legend>
        <section>
        <select name="repeatStop">
            <option value="never">Never</option>
            <option value="number">After # of Repeats</option>
            <option value="date">After a date</option>
        </select>
        <input type="number" id="repeatStopCount" name="repeatStopCount" min="1" max="999" step="1" value="1">
        <input type="date" id="repeatStopDate" name="repeatStopDate"> 
        </section>
    </fieldset>
</form>
`

joplin.plugins.register({
	onStart: async function() {
		
		// Send Logging info
		console.info('Repeating To-Dos Plugin started!');

		// Create Dialog 
		const recurrenceDialog = await joplin.views.dialogs.create('recurrenceDialog');
		await joplin.views.dialogs.setHtml(recurrenceDialog, recurrenceDialogHTML);
		await joplin.views.dialogs.addScript(recurrenceDialog, 'recurrenceDialog.js')
		await joplin.views.dialogs.addScript(recurrenceDialog, 'recurrenceDialog.css')

		// Create Toolbar Button
		await joplin.commands.register({
			name: 'editRecurrence',
			label: 'Open Recurrence Dialog',
			iconName: 'fas fa-redo-alt',
			execute: async () => {
				const result3 = await joplin.views.dialogs.open(recurrenceDialog);
				console.info('Got result: ' + JSON.stringify(result3));				
			},
		});
		await joplin.views.toolbarButtons.create('myButton1', 'editRecurrence', ToolbarButtonLocation.NoteToolbar);
	},
});

import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';


joplin.plugins.register({
	onStart: async function() {
		
		// Send Logging info
		console.info('Test plugin2 started!');

		// Create Toolbar Button
		await joplin.commands.register({
			name: 'editRecurrence',
			label: 'Open Recurrence Dialog',
			iconName: 'fas fa-redo-alt',
			execute: async () => {
				alert('Testing plugin command2 1');
			},
		});
		await joplin.views.toolbarButtons.create('myButton1', 'editRecurrence', ToolbarButtonLocation.NoteToolbar);

		// Create Dialog
		const dialogs = joplin.views.dialogs;


		const handle3 = await dialogs.create('myDialog3');
		await dialogs.setHtml(handle3, `
		<h1>Repeating To-Do</h1>
		<form name="recurrence">
			<fieldset> 
				<legend>Enabled</legend>
				<input type="checkbox" id="recurrenceEnabled" name="recurrenceEnabled" value="True">
				<label for="recurrenceEnabled">This Task Repeats</label></td>
			</fieldset>
			</br>
			<fieldset>
				<legend>Interval</legend>
				<input type="number" id="repeatPeriod" name="repeatPeriod" min="1" max="999" step="1" value="1">
				<select name="repeatInterval">
					<option value="minute" selected>Minute</option>
					<option value="hour">Hour</option>
					<option value="day">Day</option>
					<option value="week">Week</option>
					<option value="month">Month</option>
					<option value="year">Year</option>
				 </select>
			</fieldset>
			</br>
			<fieldset>
				<legend>Weekdays</legend>
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
			</fieldset>
			</br>
			<fieldset>
				<legend>Day of Month</legend>
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
			</fieldset>
			</br>
			<fieldset>
				<legend>Repeating Stops</legend>
				<select name="repeatStop">
					<option value="never">Never</option>
					<option value="number">After # of Repeats</option>
					<option value="date">After a date</option>
				</select>
				<input type="number" id="repeatStopCount" name="repeatStopCount" min="1" max="999" step="1" value="1">
				<input type="date" id="repeatStopDate" name="repeatStopDate"> 
			</fieldset>

		</form>
		`);

		const result3 = await dialogs.open(handle3);
		console.info('Got result: ' + JSON.stringify(result3));		

	},
});

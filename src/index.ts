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
		<p>Task Recurrence</p>
		<form name="recurrence">

			<section>
				<label for="recurrenceEnabled">Repeat Enabled: </label>
				<input type="checkbox" id="recurrenceEnabled" name="recurrenceEnabled" value="True">
			</section>
			
			<section>
				<label for="repeatPeriod">Repeat Period: </label>
				<input type="number" id="repeatPeriod" name="repeatPeriod" min="1" max="999" step="1" value="1">
				<select name="repeatInterval">
					<option value="minute" selected>Minute</option>
					<option value="hour">Hour</option>
			 </select>
			</section>

			Name: <input type="text" name="name"/>
			<br/>
			Email: <input type="text" name="email"/>
		</form>
		`);

		const result3 = await dialogs.open(handle3);
		console.info('Got result: ' + JSON.stringify(result3));		

	},
});

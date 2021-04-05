import joplin from 'api';
import {ToolbarButtonLocation } from 'api/types';


joplin.plugins.register({
	onStart: async function() {
		
		// Send Logging info
		console.info('Repeating To-Dos Plugin started!');

		// Create Dialog 
		const Dialog = await joplin.views.dialogs.create('Dialog');
        const DialogHTML = await require('./Dialog.html').default;
        await joplin.views.dialogs.setHtml(Dialog, DialogHTML);
		await joplin.views.dialogs.addScript(Dialog, 'Dialog.js')
		await joplin.views.dialogs.addScript(Dialog, 'Dialog.css')

		// Create Toolbar Button
		await joplin.commands.register({
			name: 'editRecurrence',
			label: 'Open Recurrence Dialog',
			iconName: 'fas fa-redo-alt',
			execute: async () => {
				const result = await joplin.views.dialogs.open(Dialog);
				console.info('Got result: ' + JSON.stringify(result));				
			},
		});
		await joplin.views.toolbarButtons.create('editRecurrenceButton', 'editRecurrence', ToolbarButtonLocation.NoteToolbar);
	},
});

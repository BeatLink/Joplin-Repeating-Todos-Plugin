# joplin-plugin-repeating-todos
A powerful and comprehensive plugin for todo repetition/recurrence

Initial design
* User clicks button to open dialog
* Dialog contains elements for user to enter recurrence details.
* Recurrence Information is saved to a database
* When user checks a task as complete, "reset date" is calculated from recurrence details and appended to list
* Loop checks list for any reset date that has passed and if yes, unchecks the recurrence date for that task, allowing the task to be done again

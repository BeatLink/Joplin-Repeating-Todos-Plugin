/** Imports ****************************************************************************************************************************************/
import joplin from "api";

/** getAllNotes *************************************************************************************************************************************
 * Gets all the notes from joplin                                                                                                                   *
 ***************************************************************************************************************************************************/
export async function getAllNotes(){
    var allNotes = []
    var pageNum = 0
	do {
		var response = await joplin.data.get(['notes'], { fields: ['id', "todo_due", "todo_completed"], page: pageNum++})
        allNotes = allNotes.concat(response.items)
	} while (response.has_more)
    return allNotes
}

/** getNote *****************************************************************************************************************************************
 * Retrieves a note with the given note id                                                                                                          *
 ***************************************************************************************************************************************************/
export async function getNote(noteID){
    try {
        return await joplin.data.get(['notes', noteID], { fields: ['id', 'todo_due', 'todo_completed']})
    } catch(error) {
        if (error.message != "Not Found") { 
            throw(error) 
        }
    }
}

/** markTaskIncomplete *****************************************************************************************************************************
 * Marks the task as incomplete                                                                                                                     *
 ***************************************************************************************************************************************************/
export async function markTaskIncomplete(id){
    await joplin.data.put(['notes', id], null, { todo_completed: 0});
}

/** markSubtasksIncomplete *****************************************************************************************************************************
 * Marks the task as incomplete                                                                                                                     *
 ***************************************************************************************************************************************************/
 export async function markSubTasksIncomplete(id){
    var note_data = await joplin.data.get(['notes', id], null); //{ todo_completed: 0}
    console.log(note_data)
}


/** setTaskDueDate **********************************************************************************************************************************
 * Sets the due date for the task with the given ID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function setTaskDueDate(id: string, date){
    await joplin.data.put(['notes', id], null, { todo_due: date.getTime()});
}

/** connectNoteChangedCallback **********************************************************************************************************************
 * Creates a polling function that runs a callback whenever a note changes                                                                          *
 ***************************************************************************************************************************************************/
 export async function connectNoteChangedCallback(callback){
    var cursor = null
    async function processChanges(){
        do {
            var response = await joplin.data.get(['events'], { fields: ['id', 'item_id', 'type'], cursor: cursor})
            for (var item of response.items) { 
                callback(item) 
            }
            cursor = response.cursor
        } while (response.has_more)    
    }
    setInterval(await processChanges, 60000)
}
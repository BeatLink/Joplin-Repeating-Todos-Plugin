/** Imports ****************************************************************************************************************************************/
import joplin from "api";


/** getAllNotes *************************************************************************************************************************************
 * Gets all the notes from joplin                                                                                                                   *
 ***************************************************************************************************************************************************/
export async function getAllNotes(){
    var allNotes = []
    let pageNum = 0
	do {
		var response = await joplin.data.get(['notes'], { fields: ['id', "todo_due"], page: pageNum++})
        allNotes = allNotes.concat(response.items)
	} while (response.has_more)
    return allNotes
}

/** getNote *****************************************************************************************************************************************
 * Retrieves a note with the given note id                                                                                                          *
 ***************************************************************************************************************************************************/
export async function getNote(noteID){
    try {
        return await joplin.data.get(['notes', noteID], { fields: ['id', 'todo_due']})
    } catch(error) {
        if (error.message != "Not Found") { 
            throw(error) 
        }
    }
}
/** markTaskUncompleted *****************************************************************************************************************************
 * Marks the task as incomplete                                                                                                                     *
 ***************************************************************************************************************************************************/
export async function markTaskUncompleted(id){
    await joplin.data.put(['notes', id], null, { todo_completed: 0});
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
            var response = await joplin.data.get(['events'], { fields: ['item_type', 'item_id', 'type', 'created_time'], cursor: cursor})
            for (var item of response.items) { 
                callback(item) 
            }
            cursor = response.cursor
        } while (response.has_more)    
    }
    setInterval(processChanges, 500)
}
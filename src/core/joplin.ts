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
 * Marks to-do lists within the note as incomplete                                                                                                                     *
 ***************************************************************************************************************************************************/
 export async function markSubTasksIncomplete(id){
    var note = await joplin.data.get(['notes', id], { fields: ['id','body']});
    await joplin.data.put(['notes', id], null, { body: note.body.replace(/\-\ \[x\]/g, "- [ ]")});
    if ((await joplin.workspace.selectedNote()).id == id){
        /*
            TODO: This codeblock should refresh the currently opened note if it changes, however, joplin currently has no means to do this. 
            A bug report has been filed. See https://github.com/laurent22/joplin/issues/5955
        */
    }

}

/** setTaskDueDate **********************************************************************************************************************************
 * Sets the due date for the task with the given ID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function setTaskDueDate(id: string, date){
    await joplin.data.put(['notes', id], null, { todo_due: date.getTime()});
}
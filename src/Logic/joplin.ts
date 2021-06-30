import joplin from "api";

export async function getAllNotes(){
    var allNotes = [];
    let pageNum = 0;
    let more_pages_exist = false;
	do {
		let response = await joplin.data.get(['notes'], { fields: ['id', 'title', 'body', 'todo_completed'], page: pageNum++})
        allNotes = allNotes.concat(response.items)
        more_pages_exist = response.has_more;
	} while (more_pages_exist)
    return allNotes;
}

export async function getNote(noteID){
    var note = null
    try {
        note = await joplin.data.get(['notes', noteID], { fields: ['id', 'title', 'body', 'todo_completed']})
    } catch(error) {
        if (error.message != "Not Found") { throw(error) }
    }
    return note
}

export async function getSelectedNote(){
    return await joplin.workspace.selectedNote()
}
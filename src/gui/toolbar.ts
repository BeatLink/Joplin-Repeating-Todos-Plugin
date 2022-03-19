
/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { ToolbarButtonLocation } from "api/types";

/** setupToolbarButton ******************************************************************************************************************************
 * Sets up buttons on the toolbar for the plugin                                                                                                    *
 ***************************************************************************************************************************************************/
export async function setupToolbar(){
    await joplin.views.toolbarButtons.create(
        'openRecurrenceDialogButton',
        'openRecurrenceDialog',
        ToolbarButtonLocation.NoteToolbar
    );    
}

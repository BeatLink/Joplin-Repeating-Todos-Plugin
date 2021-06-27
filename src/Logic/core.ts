// Imports ########################################################################################
import { openRecurrenceDialog} from '../GUI/Dialog/Dialog';
import { setupToolbar } from '../GUI/Toolbar/Toolbar';
import { setupDatabase } from '../Database/database';

async function setupGUI(){
    

// Main ###########################################################################################
export async function main() {
    await console.info('Repeating To-Dos Plugin started!');         // Log startup to console
    await setupDatabase();                                          // Setup Database
    await setupToolbar();                                           // Setup GUI
}



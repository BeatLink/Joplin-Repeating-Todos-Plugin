import { setupGUI }  from '../GUI/core';
//import { setupDatabase } from '../Archive/Database/database';


export async function main() {

        //Log startup to console
        await console.info('Repeating To-Dos Plugin started!');

        //Setup UI
        await setupGUI();
    

}
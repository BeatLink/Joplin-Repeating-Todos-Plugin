import { createDialog } from './Dialog/Dialog';
import { setupToolbar } from './Toolbar/Toolbar';

function getResults(result){
    console.info('Got result: ' + JSON.stringify(result));
}

export async function setupGUI(){
    await setupToolbar(await createDialog(), getResults);
}
import joplin from 'api';

function loadDialogData() {


}

function getDialogData() {

}

export async function createDialog(){
    const Dialog = await joplin.views.dialogs.create('Dialog');
    const DialogHTML = await require('./Dialog.html').default;
    await joplin.views.dialogs.setHtml(Dialog, DialogHTML);
    await joplin.views.dialogs.addScript(Dialog, './GUI/Dialog/Dialog.js')
    await joplin.views.dialogs.addScript(Dialog, './GUI/Dialog/Dialog.css')
    return Dialog;
}

/* Imports ***************************************************************************************/
import joplin from 'api';
import { main } from './core';

/* Plugin Registration ****************************************************************************
    Registers the plugin with joplin.
*/
joplin.plugins.register({
    onStart: async function() {
        main();
    },
});

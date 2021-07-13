/* Imports ********************************************************************************************************************************/
import joplin from 'api';
import { main } from './Logic/core';

/* Plugin Registration ********************************************************************************************************************
    Registers the plugin with joplin.
*/
joplin.plugins.register({                                               // calls the register function
    onStart: async function() { main() },                               // Sets the onStart function to main
});

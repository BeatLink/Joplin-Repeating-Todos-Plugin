import joplin from 'api';
import { main } from './Logic/core';

joplin.plugins.register({
    onStart: async function() {
        main();
    },
});

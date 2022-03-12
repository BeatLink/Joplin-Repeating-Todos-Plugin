import joplin from "api";
import { updateAllRecurrences } from "./recurrence";

var timer = null

export async function setupTimer(){
    clearInterval(timer)
    timer = setInterval(updateAllRecurrences, await joplin.settings.value("updateFrequency") * 1000);
}
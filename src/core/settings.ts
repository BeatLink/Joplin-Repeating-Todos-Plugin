import joplin from "api"
import { SettingItemType } from "api/types"
import { setupTimer } from "./timer"

/** configureSettings *******************************************************************************************************************************
 * Configures all settings for the plugin																											*
 ***************************************************************************************************************************************************/
export async function setupSettings(){
    await joplin.settings.registerSection("repeating-todos", {
		label: "Repeating To-dos",
		iconName: 'fa fa-redo-alt',
		name: "Repeating To-dos"
	})
    await joplin.settings.registerSettings({
		"updateFrequency": {
			label: "How many seconds should Repeating To-dos wait before updating recurrence information",
			value: 30,
			type: SettingItemType.Int,
			public: true,
			section: 'repeating-todos',
		}
	})
	await joplin.settings.onChange(setupTimer)
}
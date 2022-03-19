/** capitalize **************************************************************************************************************************************
 * Capitalizes the first letter of a given word. Based on https://stackoverflow.com/a/49298340                                                      *
 ***************************************************************************************************************************************************/
export function capitalize(word: string) {
    return word[0].toUpperCase() + word.substring(1).toLowerCase()
}

export async function sleep(ms: number) {
    function _sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await _sleep(ms);
}


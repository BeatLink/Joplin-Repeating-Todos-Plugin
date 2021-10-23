/* capitalize *************************************************************************************************************************
    Capitalizes the first letter of a given word
    Based on https://stackoverflow.com/a/49298340
*/
export function capitalize(word: string) {
    return word[0].toUpperCase() + word.substr(1).toLowerCase()         // Capitalize the first letter and lowercase the rest, concatenate then return
}
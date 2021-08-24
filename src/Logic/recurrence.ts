/* Recurrence *****************************************************************************************************************************

    Handles all matters relating to tasks that repeat on a periodical basis
    
    Properties

    enabled
        This is a boolean that determines whether the task reccurs or not. If false, this task will not be processed at all by the recurrence
        system once flagged as complete. 

    interval
        This string specifies the interval between recurrences. Eg. every minute, every hour, every day ect. 
        Valid values are: ['minute', 'hour', 'day', 'week', 'month', 'year']

    intervalNumber
        This number represents the number of the above interval between recurrences. Eg every 1 minute, every 2 minute, every 3 minute, ect.
        Valid values are positive integers from 1 upwards

    weekSunday to weekSaturday
        These seven booleans determine which days of the week a weekly task can reccur on. Eg. If weekMonday, weekWednesday and weekFriday
        are true  and all the others are false, the task will repeat every x number of weeks on Monday, Wednesday and Friday. 
    
    monthOrdinal and monthWeekday
        If both are set, these two strings determine which day of the month a monthly task can repeat on. Eg. If month ordinal is set to 
        'second' and  monthWeekday is set to 'friday', the task will repeat every month on the second friday. If one or both strings arent set, 
        the task will only recur every month on the day it was completed, not a particular weekday in the month. 
        Valid values for monthOrdinal are ['first', 'second', 'third', 'fourth', 'last']
        Valid values for monthWeekday are ['', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    stopType, stopDate and stopNumber
        These string, date and integer respectively, describe the criteria for when the task should stop recurring. If stopType is set to 'never', 
        the task will recur indefinitely. If the stopType is set to 'date' the task will stop recurring on the date specified in stopDate. 
        If stopType is set to 'number', the task will only repeat for the number of times specified in stopNumber. Eg, repeat 5 times
        Valid values for stopType are ['never', 'date', 'number']
        Valid values stop date are null and any datetime object
        Valid values for stopNumber are any positive integer (zero and above)
*/

import { tr } from "date-fns/locale";

export class Recurrence {
    enabled = false;                                                    // Indicates whether task recurrs or not
    interval = 'minute';                                                // Interval between recurrences 
    intervalNumber = 1;                                                 // Number of intervals between recurrences, eg every 5 minutes or every 2 days. 
    weekSunday = false;                                                 // True if task is to be done on Sunday
    weekMonday = false;                                                 // True if task is to be done on Monday
    weekTuesday = false;                                                // True if task is to be done on Tuesday
    weekWednesday = false;                                              // True if task is to be done on Wednesday
    weekThursday = false;                                               // True if task is to be done on Thursday
    weekFriday = false;                                                 // True if task is to be done on Friday
    weekSaturday = false;                                               // True if task is to be done on Saturday
    monthOrdinal = 'first';                                             // The position of the weekday of the month a monthly task should repeat on
    monthWeekday = '';                                                  // The weekday of the month a monthly task should recur on
    stopType = 'never'                                                  // Indicates the stop criteria. 
    stopDate = null                                                     // The date the task should stop repeating.
    stopNumber = 1                                                      // The number of times a task should repeat.
    nextResetDate = null                                                  // The next date and time the task should be done. The task should be marked uncomplete on this date


    /* getString **************************************************************************************************************************
        Returns a human readable string representing the recurrence. 
        Example 1: Every minute
        Example 2: Every 3 days
        Example 3: Every week on Sunday
        Example 4: Every week on Monday and Friday
        Example 5: Every week on Monday, Wednesday and Friday
        Example 6: Every month on the first Wednesday
        Example 7: Never
    */
    public getString(){
        var recurrenceString = ""                                       // Initialize recurrence string to blank string
        if (this.enabled) {                                             // If recurrence is enabled
            if (this.intervalNumber == 1) {                             // If interval number is 1
                recurrenceString += `Every ${this.interval}`            // add every interval
            }
            if (this.intervalNumber > 1) {                              // If interval number is greater than 1
                recurrenceString += `Every ${this.intervalNumber} ${this.interval}s`    // Add number of intervals and pluralzie interval
            }
            if (this.interval == 'Week'){                               // If interval is week
                var weekArray = []                                      // create a weekdays array
                for (var weekDay in this.getWeekdaysInt()){             // for weekday in enabled weekdays
                    weekArray.push(capitalize(this.weekdayArray[weekDay]))  // add the capitalized weekday string to the array
                }
                if (weekArray.length == 1){                             // if the weekday array length is exactly one
                    recurrenceString += ` on ${weekArray.pop()}`        // add on weekday
                } else if (weekArray.length == 2){                      // if weekday array length is exactly two
                    recurrenceString += ` on ${weekArray.shift()} and ${weekArray.shift()}` // add both weekdays seperated by and
                } else if (weekArray.length > 2){                       // if weekday array greater than two
                    var lastDay = weekArray.pop()                       // save last day in variable
                    recurrenceString += ` on ${weekArray.join(', ')} and ${lastDay}`    // add weekdays string seperated by commas and last day appended with and
                }
            } else if (this.interval == 'Month' && this.monthOrdinal != '' && this.monthWeekday != '') {    // if interval is month and month weekday is set
                recurrenceString += ` on the ${this.monthOrdinal} ${capitalize(this.monthWeekday)}`;    // add month weekday to string
            }
        } else {                                                        // Else (recurrence not enabled)
            recurrenceString = "Never"                                  // Set string to never
        }
        return recurrenceString;                                        // Return the string
    }

    /* getNextDate ************************************************************************************************************************        
        Gets the next date and time after the initial date that the task would repeat
        
        * For all intervals without without special cases such as specific weekdays of weeks and nth weekdays of months the method increments 
        its respective interval by the given interval number

        If a weekday is set for a weekly recurrence, the method will find the enabled weekdays for initial date's week and the next date's week
        and then set the next date to the soonest valid weekday after the initial date

        If an nth weekday is set for a monthly recurrence, the method will find the nth weekday for the initial month and the next dates month
        and then set the next date to the soonest weekday after the initial date

        This method gets the next valid weekday of the month. It does it by doing the following
        * Find the 2 valid months: the initial month and the intervalnumbered month.
        * Find all matching weekdays within the month and save to list
        * Use the ordinal as the index to the matching weekday list to get the correct weekdays for both months
        * Add the 2 correct weekdays to a final list
        * sorts the list and then chooses the soonest date that comes after the initial date
    */
    public getNextDate(initialDate){
        if (this.enabled){                                                                  // Only return dates if recurrence enabled
            var nextDate = new Date(initialDate.getTime());                                 // Create next date from initial date    
            if (this.interval == 'minute') {                                                // If interval is minute
                nextDate.setMinutes(initialDate.getMinutes() + this.intervalNumber)         // Increment next date by number of minutes
            } else if (this.interval == 'hour') {                                           // If interval is hour
                nextDate.setHours(initialDate.getHours() + this.intervalNumber)             // Increment next date by number of hours
            } else if (this.interval == 'day') {                                            // If interval is day
                nextDate.setDate(initialDate.getDate() + this.intervalNumber)               // Increment next date by number of days
            } else if (this.interval == 'week') {                                           // If interval is week
                nextDate.setDate(nextDate.getDate() + this.intervalNumber * 7)              // Increment next date by number of weeks
                if (this.getWeekdaysInt().length > 0){                                      // If at least one weekday is enabled
                    var initialWeekdays = this.getWeekdays(initialDate)                     // Get valid weekdays for initial week
                    var nextWeekdays = this.getWeekdays(nextDate)                           // Get valid weekdays for next week
                    var validWeekdays = initialWeekdays.concat(nextWeekdays)                // combine valid weekdays of initial and next week
                    validWeekdays.sort((a,b)=>{return a.getTime()-b.getTime()})             // Sort the weekdays from earliest to latest
                    for (var weekDate of validWeekdays){                                    // for weekday of valid weekdays
                        if (weekDate.getTime() > initialDate.getTime()){                    // if weekday is after initial date
                            nextDate.setTime(weekDate.getTime())                            // Set the next date weekday
                            break                                                           // break the for loop
                        }
                    }
                }
            } else if (this.interval == 'month') {                                          // If interval is month
                nextDate.setMonth(initialDate.getMonth() + this.intervalNumber)             // Increment next date to number of months
                if (this.monthOrdinal != "" && this.monthWeekday != ""){                    // If month ordinal and month weekday is present
                    var initialMonthDate = new Date(this.getMonthWeekday(initialDate))      // Get month weekday for initial month
                    var nextMonthDate = new Date(this.getMonthWeekday(nextDate))            // Get month weekday for next month
                    var validMonthDates = [initialMonthDate, nextMonthDate]                 // create array with both month weekdays
                    validMonthDates.sort((a,b)=>{return a.getTime()-b.getTime()})           // sort the month weekdays from earliest to latest
                    for (var monthDate of validMonthDates){                                 // for month weekday in array
                        if (monthDate > initialDate){                                       // if weekday is after initial date
                            nextDate.setTime(monthDate.getTime())                           // set the next date
                            break                                                           // break the for loop
                        }
                    }
                }
            } else if (this.interval == 'year') {                                           // if the interval is year
                nextDate.setFullYear(initialDate.getFullYear() + this.intervalNumber)       // increment the next date by number of years
            }
            return nextDate;                                                                // Return the next date
        }
    }

    public getFutureDate(initialDate){

        var currentDate = initialDate
        var now = Date.now()
        while (true){
            if (currentDate > now){
                return currentDate
            } else {
                currentDate = this.getNextDate(currentDate)
            }

        }
    }

    /* updateStopStatus *******************************************************************************************************************
        Stops task from repeating if necessary or updates the stop repeating resources.
        * If the stop type is date and the stop date has passed, disable recurrence
        * If the stop type is number and the number of recurrences is 1 or less, disable recurrence
        * If the stop type is number and the number of recurrences is greater than 1, subtract 1 from the recurrence
    */
    public updateStopStatus(){
        if (this.stopType == 'date'){                                   // If stop type is date...
            if (new Date(this.stopDate) < new Date()){                  // And if stop date has passed...
                this.enabled = false                                    // Disable recurrence
            }   
        } else if (this.stopType == 'number'){                          // If stop type is number...
            if (this.stopNumber <= 1){                                  // And stop number is less than or 1...
                this.enabled = false                                   // Disable recurrence
            } else {                                                    // Else...
                this.stopNumber = this.stopNumber - 1                   // decrement stop number by 1
            }
        }
    }

    /* Private constants *****************************************************************************************************************/
    private weekdayArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    private ordinalArray = ['first', 'second', 'third', 'fourth', 'last']

    /* getEnabledWeekdays *****************************************************************************************************************
        Returns an array of all the enabled weekdays for the current week of a given date.  
    */
    private getWeekdays(date){
        var enabledWeekdays = []                                        // Initialize array for enabled Weekdays
        for (var weekday of this.getWeekdaysInt()) {                    // for every enabled weekday
            var newDate = new Date(date)                                // Create New date for manipulation
            newDate.setDate(newDate.getDate() - newDate.getDay() + weekday) // set the weekday date to the enabled weekday of the week in question
            enabledWeekdays.push(newDate)                               // Add it to the enabled weekdays array
        }
        return enabledWeekdays                                          // Return the enabled weekdays array
    }

    /* getEnabledWeekdaysInt **************************************************************************************************************
        Returns an array of integers ranging from 0-6 representing the enabled days. 0=Mon, 1=Tue...5=Sat, 6=Sun
    */
    private getWeekdaysInt(){
        var weekArray = []                                              // Create week array
        if (this.weekSunday == true) {weekArray.push(0)}                // If sunday enabled add 0 to array
        if (this.weekMonday == true) {weekArray.push(1)}                // If monday enabled add 1 to array
        if (this.weekTuesday == true) {weekArray.push(2)}               // If tuesday enabled add 2 to array
        if (this.weekWednesday == true) {weekArray.push(3)}             // If wednesday enabled, add 3 to array
        if (this.weekThursday == true) {weekArray.push(4)}              // If thursday enabled add 4 to array
        if (this.weekFriday == true) {weekArray.push(5)}                // If friday enabled add 5 to array
        if (this.weekSaturday == true) {weekArray.push(6)}              // If saturday enabled add 6 to array
        return weekArray                                                // Return the array

    } 

    /* getMonthWeekday ********************************************************************************************************************
        Gets the nth weekday of the month of the given date according to the monthOrdinal and monthWeekday variables
        It does this by compiling a list of matching weekdays in the given month, eg all the thursdays in this month
        Next it then gets the nth weekday of the list, determined by the monthOrdinal, eg. the second thursday of the month
    */
    private getMonthWeekday(date: Date){
        var ordinal = this.ordinalArray.indexOf(this.monthOrdinal)      // Get the month ordinal as integer    
        var weekday = this.weekdayArray.indexOf(this.monthWeekday)      // Get the month weekday as integer
        var weekdays = [];                                              // Create array for matching weekdays
        var startDate = new Date(date)                                  // Create a new date for manipulation
        var currentMonth = startDate.getMonth()                         // Save the current month for while loop check
        startDate.setDate(1)                                            // Go to Beginning of the Week
        while (startDate.getMonth() === currentMonth) {                 // While still in current month...
            if (startDate.getDay() == weekday){                         // If this day matches the month weekday...
                weekdays.push(new Date(startDate));                     // Add this day to the weekday list
            }
            startDate.setDate(startDate.getDate() + 1);                 // go to the next day
        }
        if (ordinal == 4){                                              // If month ordinal is last
            return weekdays.pop()                                       // Return last weekday
        } else {                                                        // else
            return weekdays[ordinal]                                    // Return the nth weekday
        }
    }

    /* toJSON *****************************************************************************************************************************
        Save recurrence data as a json string
    */
    public toJSON(){
        return JSON.stringify({                                         // Returns a json string of an object containing...
            enabled: this.enabled,                                      // The enabled status
            interval: this.interval,                                    // The interval
            intervalNumber: this.intervalNumber,                        // The intervalNumber
            weekSunday: this.weekSunday,                                // Sundays status
            weekMonday: this.weekMonday,                                // Mondays status
            weekTuesday: this.weekTuesday,                              // Tuesdays status
            weekWednesday: this.weekWednesday,                          // Wednesdays status
            weekThursday: this.weekThursday,                            // Thursdays Status
            weekFriday: this.weekFriday,                                // Fridays Status
            weekSaturday: this.weekSaturday,                            // Saturdays Status
            monthOrdinal: this.monthOrdinal,                            // The month ordinal
            monthWeekday: this.monthWeekday,                            // The month Weekday
            stopType: this.stopType,                                    // The stop type
            stopDate: this.stopDate,                                    // The stop date
            stopNumber: this.stopNumber,                                 // The stop Number
            nextResetDate: this. 
        })
    }

    /* fromJSON ***************************************************************************************************************************
        Loads Recurrence data from a JSON string
    */
    public fromJSON(JSONstring: string){
        var dataObject = JSON.parse(JSONstring)                         // Parse the JSON string into a data object
        this.enabled = Boolean(dataObject.enabled)                      // Save enabled status
        this.intervalNumber = Number(dataObject.intervalNumber)         // Save interval number
        this.interval = String(dataObject.interval);                    // Save interval
        this.weekSunday = Boolean(dataObject.weekSunday)                // Save Sunday status
        this.weekMonday = Boolean(dataObject.weekMonday)                // Save Monday status
        this.weekTuesday = Boolean(dataObject.weekTuesday)              // Save Tuesday status
        this.weekWednesday = Boolean(dataObject.weekWednesday)          // Save Wednesday status
        this.weekThursday = Boolean(dataObject.weekThursday)            // Save Thursday status
        this.weekFriday = Boolean(dataObject.weekFriday)                // Save Friday status
        this.weekSaturday = Boolean(dataObject.weekSaturday)            // Save Saturday Status
        this.monthOrdinal = String(dataObject.monthOrdinal)             // Save month ordinal
        this.monthWeekday = String(dataObject.monthWeekday)             // Save Month Weekday
        this.stopType = String(dataObject.stopType)                     // Save Stop Type
        this.stopDate = String(dataObject.stopDate)                     // Save Stop Date
        this.stopNumber = Number(dataObject.stopNumber)                 // Save Stop Number
    }
}


/* capitalize *************************************************************************************************************************
    Capitalizes the first letter of a given word
    Based on https://stackoverflow.com/a/49298340
*/
function capitalize(word: string) {
    return word[0].toUpperCase() + word.substr(1).toLowerCase()         // Capitalize the first letter and lowercase the rest, concatenate then return
}
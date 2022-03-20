/** Recurrence **************************************************************************************************************************************
 * Handles all matters relating to tasks that repeat on a periodical basis                                                                          *
 *                                                                                                                                                  *
 * Properties:                                                                                                                                      *
 *                                                                                                                                                  *
 *  enabled                                                                                                                                         *
 *      This is a boolean that determines whether the task reccurs or not. If false, this task will not be processed at all by the recurrence       *
 *      system once flagged as complete.                                                                                                            *
 *                                                                                                                                                  *
 *  interval                                                                                                                                        *
 *      This string specifies the interval between recurrences. Eg. every minute, every hour, every day ect.                                        *
 *      Valid values are: ['minute', 'hour', 'day', 'week', 'month', 'year']                                                                        *
 *                                                                                                                                                  *
 *  intervalNumber                                                                                                                                  *
 *      This number represents the number of the above interval between recurrences. Eg every 1 minute, every 2 minute, every 3 minute, ect.        *
 *      Valid values are positive integers from 1 upwards                                                                                           *
 *                                                                                                                                                  *
 *  weekSunday to weekSaturday                                                                                                                      *
 *      These seven booleans determine which days of the week a weekly task can reccur on. Eg. If weekMonday, weekWednesday and weekFriday          *
 *      are true  and all the others are false, the task will repeat every x number of weeks on Monday, Wednesday and Friday.                       *
 *                                                                                                                                                  *
 *  monthOrdinal and monthWeekday                                                                                                                   *
 *      If both are set, these two strings determine which day of the month a monthly task can repeat on. Eg. If month ordinal is set to            *
 *      'second' and  monthWeekday is set to 'friday', the task will repeat every month on the second friday. If one or both strings arent set,     *
 *      the task will only recur every month on the day it was completed, not a particular weekday in the month.                                    *
 *      Valid values for monthOrdinal are ['first', 'second', 'third', 'fourth', 'last']                                                            *
 *      Valid values for monthWeekday are ['', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']                        *
 *                                                                                                                                                  *
 *  stopType, stopDate and stopNumber                                                                                                               *
 *      These string, date and integer respectively, describe the criteria for when the task should stop recurring. If stopType is set to 'never',  *
 *      the task will recur indefinitely. If the stopType is set to 'date' the task will stop recurring on the date specified in stopDate.          *
 *      If stopType is set to 'number', the task will only repeat for the number of times specified in stopNumber. Eg, repeat 5 times               *
 *      Valid values for stopType are ['never', 'date', 'number']                                                                                   *
 *      Valid values stop date are null and any datetime object                                                                                     *
 *      Valid values for stopNumber are any positive integer (zero and above)                                                                       *
 *                                                                                                                                                  *
 ***************************************************************************************************************************************************/

import { capitalize } from "../core/misc"

export class Recurrence {

    /** Public Variables ***************************************************************************************************************************/
    public enabled = false
    public interval = 'minute'
    public intervalNumber = 1
    public weekSunday = false
    public weekMonday = false
    public weekTuesday = false
    public weekWednesday = false
    public weekThursday = false
    public weekFriday = false
    public weekSaturday = false
    public monthOrdinal = 'first'
    public monthWeekday = ''
    public stopType = 'never'
    public stopDate = null
    public stopNumber = 1

    /** Private Constants **************************************************************************************************************************/
    private weekdayStrings = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    private monthOrdinalStrings = ['first', 'second', 'third', 'fourth', 'last']

    /** getString ***********************************************************************************************************************************
     * Returns a human readable string representing the recurrence.                                                                                 *
     * Example 1: Every minute                                                                                                                      *
     * Example 2: Every 3 days                                                                                                                      *
     * Example 3: Every week on Sunday                                                                                                              *
     * Example 4: Every week on Monday and Friday                                                                                                   *
     * Example 5: Every week on Monday, Wednesday and Friday                                                                                        *
     * Example 6: Every month on the first Wednesday                                                                                                *
     * Example 7: Never                                                                                                                             *
     ***********************************************************************************************************************************************/
    public getString(){
        var string = ""
        if (this.enabled) {
            if (this.intervalNumber == 1) {
                string += `Every ${this.interval}`
            } else if (this.intervalNumber > 1) {
                string += `Every ${this.intervalNumber} ${this.interval}s`
            }
            if (this.interval == 'week'){
                var weekArray = this.getWeekdaysInt().map((weekDay, _index, _array) => capitalize(this.weekdayStrings[weekDay]))
                if (weekArray.length == 1){
                    string += ` on ${weekArray.pop()}`
                } else if (weekArray.length == 2){
                    string += ` on ${weekArray.shift()} and ${weekArray.shift()}`
                } else if (weekArray.length > 2){
                    var lastDay = weekArray.pop()
                    string += ` on ${weekArray.join(', ')} and ${lastDay}`
                }
            } else if (this.interval == 'month' && this.monthOrdinal != '' && this.monthWeekday != '') {
                string += ` on the ${this.monthOrdinal} ${capitalize(this.monthWeekday)}`;
            }
        } else {
            string = "Never"
        }
        return string;
    }

    /** getNextDate *********************************************************************************************************************************
     *                                                                                                                                              *
     * Gets the next date and time after the initial date that the task would repeat                                                                *
     *                                                                                                                                              *
     * For all intervals without without special cases (such as specific weekdays of weeks and nth weekdays of months), the method increments its   *
     * respective interval by the given interval number.                                                                                            *
     *                                                                                                                                              *
     * If a weekday is set for a weekly recurrence, the method will find the valid weekdays for initial date's week and the next date's week        *
     * and then set the next date to the soonest valid weekday after the initial date.                                                              *
     *                                                                                                                                              *
     * If an nth weekday is set for a monthly recurrence, the method will find the nth weekday for the initial month and the next dates month       *
     * and then set the next date to the soonest weekday after the initial date.                                                                    *
     *                                                                                                                                              *
     ***********************************************************************************************************************************************/
    public getNextDate(initial){
        if (this.enabled){
            var next = new Date(initial.getTime());
            if (this.interval == 'minute') {
                next.setMinutes(initial.getMinutes() + this.intervalNumber)
            } else if (this.interval == 'hour') {
                next.setHours(initial.getHours() + this.intervalNumber)
            } else if (this.interval == 'day') {
                next.setDate(initial.getDate() + this.intervalNumber)
            } else if (this.interval == 'week') {
                next.setDate(next.getDate() + this.intervalNumber * 7)
                if (this.getWeekdaysInt().length > 0){
                    var validWeekdays = this.getWeekdays(initial).concat(this.getWeekdays(next))
                    validWeekdays.sort((a,b)=>{return a.getTime()-b.getTime()})
                    for (var weekDate of validWeekdays){
                        if (weekDate.getTime() > initial.getTime()){
                            next.setTime(weekDate.getTime())
                            break
                        }
                    }
                }
            } else if (this.interval == 'month') {
                next.setMonth(initial.getMonth() + this.intervalNumber)
                if (this.monthOrdinal != "" && this.monthWeekday != ""){
                    var initialDate = new Date(this.getMonthWeekday(initial))
                    var nextDate = new Date(this.getMonthWeekday(next))
                    var validMonthDates = [initialDate, nextDate]
                    validMonthDates.sort((a,b)=>{return a.getTime()-b.getTime()})
                    for (var monthDate of validMonthDates){
                        if (monthDate > initial){
                            next.setTime(monthDate.getTime())
                            break
                        }
                    }
                }
            } else if (this.interval == 'year') {
                next.setFullYear(initial.getFullYear() + this.intervalNumber)
            }
            return next;
        }
    }

    public getNextDateAfter(initial, after){
        if (this.enabled){
            var newDate = initial
            console.log(`initial ${initial} after ${after}`)
            while (newDate < after) {
                newDate = this.getNextDate(newDate)
                console.log(`newDate ${newDate}`)
            }    
        }
    }

    /** updateStopStatus ****************************************************************************************************************************
     * Stops task from repeating if necessary or updates the stop repeating resources.                                                              *
     * If the stop type is date and the stop date has passed, disable recurrence.                                                                   *
     * If the stop type is number and the number of recurrences is 1 or less, disable recurrence.                                                   *
     * If the stop type is number and the number of recurrences is greater than 1, subtract 1 from the recurrence.                                  *
     ***********************************************************************************************************************************************/
    public updateStopStatus(){
        if (this.stopType == 'date' && new Date(this.stopDate) < new Date()){
            this.enabled = false
        } else if (this.stopType == 'number'){
            if (this.stopNumber <= 1){
                this.enabled = false
            } else {
                this.stopNumber = this.stopNumber - 1
            }
        }
    }

    /** getEnabledWeekdays **************************************************************************************************************************
     * Returns an array of all the enabled weekdays for the current week of a given date.                                                           *
     ***********************************************************************************************************************************************/
    private getWeekdays(date){
        return this.getWeekdaysInt().map((weekday) => {
            var newDate = new Date(date)
            newDate.setDate(newDate.getDate() - newDate.getDay() + weekday)
            return newDate
        })
    }

    /** getEnabledWeekdaysInt ***********************************************************************************************************************
     * Returns an array of integers ranging from 0-6 representing the enabled days. 0=Mon, 1=Tue...5=Sat, 6=Sun                                     *
     ***********************************************************************************************************************************************/

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
        var ordinal = this.monthOrdinalStrings.indexOf(this.monthOrdinal)      // Get the month ordinal as integer    
        var weekday = this.weekdayStrings.indexOf(this.monthWeekday)      // Get the month weekday as integer
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
}


/** recurrenceToJSON ********************************************************************************************************************************
 * Save recurrence data as a json string                                                                                                            *
 ***************************************************************************************************************************************************/
 export function recurrenceToJSON(recurrence) {
    return JSON.stringify({
        enabled: recurrence.enabled,
        interval: recurrence.interval,
        intervalNumber: recurrence.intervalNumber,
        weekSunday: recurrence.weekSunday,
        weekMonday: recurrence.weekMonday,
        weekTuesday: recurrence.weekTuesday,
        weekWednesday: recurrence.weekWednesday,
        weekThursday: recurrence.weekThursday,
        weekFriday: recurrence.weekFriday,
        weekSaturday: recurrence.weekSaturday,
        monthOrdinal: recurrence.monthOrdinal,
        monthWeekday: recurrence.monthWeekday,
        stopType: recurrence.stopType,
        stopDate: recurrence.stopDate,
        stopNumber: recurrence.stopNumber,
    });
}

/** recurrenceFromJSON **************************************************************************************************************************
 * Loads Recurrence data from a JSON string                                                                                                     *
 ***********************************************************************************************************************************************/
export function recurrenceFromJSON(JSONstring){
    var parsedJSON = JSON.parse(JSONstring)
    var recurrence = new Recurrence()
    recurrence.enabled = Boolean(parsedJSON.enabled)
    recurrence.intervalNumber = Number(parsedJSON.intervalNumber)
    recurrence.interval = String(parsedJSON.interval)
    recurrence.weekSunday = Boolean(parsedJSON.weekSunday)
    recurrence.weekMonday = Boolean(parsedJSON.weekMonday)
    recurrence.weekTuesday = Boolean(parsedJSON.weekTuesday)
    recurrence.weekWednesday = Boolean(parsedJSON.weekWednesday)
    recurrence.weekThursday = Boolean(parsedJSON.weekThursday)
    recurrence.weekFriday = Boolean(parsedJSON.weekFriday)
    recurrence.weekSaturday = Boolean(parsedJSON.weekSaturday)
    recurrence.monthOrdinal = String(parsedJSON.monthOrdinal)
    recurrence.monthWeekday = String(parsedJSON.monthWeekday)
    recurrence.stopType = String(parsedJSON.stopType)
    recurrence.stopDate = String(parsedJSON.stopDate)
    recurrence.stopNumber = Number(parsedJSON.stopNumber)
    return recurrence
}
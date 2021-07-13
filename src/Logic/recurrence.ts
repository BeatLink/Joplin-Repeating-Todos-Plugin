/*********************************************************** READ ME **********************************************************************

    The recurrence logic contained in this file started out as a part of an old python todo app project of mine, this most of this code
    is in the python syntax and would need to be ported to typescript equivalents before it will be functional. Do not use any file with
    this notice.

******************************************************************************************************************************************/


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
        Valid values for monthOrdinal are ['', 'first', 'second', 'third', 'fourth', 'last']
        Valid values for monthWeekday are ['', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    stopType, stopDate and stopNumber
        These string, date and integer respectively, describe the criteria for when the task should stop recurring. If stopType is set to 'never', 
        the task will recur indefinitely. If the stopType is set to 'date' the task will stop recurring on the date specified in stopDate. 
        If stopType is set to 'number', the task will only repeat for the number of times specified in stopNumber. Eg, repeat 5 times
        Valid values for stopType are ['never', 'date', 'number']
        Valid values stop date are null and any datetime object
        Valid values for stopNumber are any positive integer (zero and above)
*/

export class Recurrence {
    enabled = false;                                                    // Indicates whether task recurrs or not
    interval = 'minute';                                                // Interval between recurrences 
    intervalNumber = 1;                                                 // Number of intervals between recurrences, eg every 5 minutes or every 2 days. 
    weekSunday = false;                                                // True if task is to be done on Sunday
    weekMonday = false;                                                // True if task is to be done on Monday
    weekTuesday = false;                                               // True if task is to be done on Tuesday
    weekWednesday = false;                                             // True if task is to be done on Wednesday
    weekThursday = false;                                              // True if task is to be done on Thursday
    weekFriday = false;                                                // True if task is to be done on Friday
    weekSaturday = false;                                              // True if task is to be done on Saturday
    monthOrdinal = '';                                                 // The position of the weekday of the month a monthly task should repeat on
    monthWeekday = '';                                                 // The weekday of the month a monthly task should recur on
    stopType = 'never'                                                 // Indicates the stop criteria. 
    stopDate = null                                                    // The date the task should stop repeating.
    stopNumber = 1                                                     // The number of times a task should repeat.

    public toJSON(){
        var dataObject = {
            enabled: this.enabled,
            interval: this.interval,
            intervalNumber: this.intervalNumber,
            weekSunday: this.weekSunday,
            weekMonday: this.weekMonday,
            weekTuesday: this.weekTuesday,
            weekWednesday: this.weekWednesday,
            weekThursday: this.weekThursday,
            weekFriday: this.weekFriday,
            weekSaturday: this.weekSaturday,
            monthOrdinal: this.monthOrdinal,
            monthWeekday: this.monthWeekday,
            stopType: this.stopType,
            stopDate: this.stopDate,
            stopNumber: this.stopNumber
        }
        return JSON.stringify(dataObject)
    }

    public fromJSON(JSONstring){
        var dataObject = JSON.parse(JSONstring)
        this.enabled = dataObject.enabled
        this.intervalNumber = dataObject.intervalNumber
        this.interval = dataObject.interval;
        this.weekSunday = dataObject.weekSunday
        this.weekMonday = dataObject.weekMonday
        this.weekTuesday = dataObject.weekTuesday
        this.weekWednesday = dataObject.weekWednesday
        this.weekThursday = dataObject.weekThursday
        this.weekFriday = dataObject.weekFriday
        this.weekSaturday = dataObject.weekSaturday
        this.monthOrdinal = dataObject.monthOrdinal
        this.monthWeekday = dataObject.monthWeekday
        this.stopType = dataObject.stopType
        this.stopDate = dataObject.stopDate
        this.stopNumber = dataObject.StopNumber
    }
 

    /* 
    Class that represents the specific weekday of the month the task will repeat on (eg, first sunday, last friday)
    */


    //public getString(){
    //    /* Returns a human readable string representing the weekday of the month */
    //    if (this.ordinal && this.weekday) {
    //        return `the ${this.ordinal} ${this.weekday[0].toUpperCase() + this.weekday.slice(1)}`;
    //    } else {
    //        return '';
    //    }
    //}


   /*
    def should_stop(self):
        """Returns boolean representing whether a task should stop repeating"""
        stop_date_passed = self.type == 'date' and self.date and self.date <= arrow.now()
        stop_number_reached = self.type == 'number' and isinstance(self.number, int) and int(self.number) <= 1
        return True if stop_date_passed or stop_number_reached else False

    def update_number(self):
        if self.type == 'number' and self.number > 1:
            self.number -= 1
    */


    /*
    public get_next_date(initial_date) {

        """
        Gets the next date and time after the initial date that the task would repeat
        """
        if self.enabled and initial_date <= arrow.now():
            if self.interval == 'week' and self.weekdays.arrow_set:
                new_date = self.weekdays.get_next_date(initial_date, self.intervalnumber)
            elif (
                    self.interval == 'month') and (
                    self.weekday_of_month.weekday is not None) and (
                    self.weekday_of_month.ordinal is not None):
                new_date = self.weekday_of_month.get_next_date(initial_date, self.intervalnumber)
            else:
                new_date = initial_date.shift(**{self.interval + 's': self.intervalnumber})
        else:
            new_date = initial_date

        # Stops task from repeating if necessary or updates the stop repeating resources
        if self.stop_info.should_stop():
            self.enabled = False
            self.stop_info.type = 'never'
        else:
            self.stop_info.update_number()

        # return the new date
        return new_date


    }
    @property
    def string(self):
        """Returns the recurrence in a human readable format. Eg Every week on thursdays"""
        if self.enabled:
            string = f'every {str(self.intervalnumber)} {self.interval}s' if self.intervalnumber > 1 else f'every {self.interval}'
            if self.interval == 'week' and self.weekdays.arrow_set:
                string += f' on {self.weekdays.string}'
            elif (
                    self.interval == 'month') and (
                    self.weekday_of_month.ordinal is not None) and (
                    self.weekday_of_month.weekday is not None):
                string += f' on {self.weekday_of_month.string}'
            return string
        else:
            return ''
        }
        */

}

export class WeekDays {
    /* ------------------------------------------------------------------------------------------------
    Contains the resources and methods related to the weekdays used in the recurrence class for 
    weekly recurrences 
    ------------------------------------------------------------------------------------------------ 



    private getMap(){
        return new Map([
            ["Sunday", this.sunday],
            ["Monday", this.monday],
            ["Tuesday", this.tuesday],
            ["Wednesday", this.wednesday],
            ["Thursday", this.thursday],
            ["Friday", this.friday],
            ["Saturday", this.saturday]
        ])
    }

    private getArray(){
        return Array.from(this.getMap().values());
    }

    /*
    private getIntegerArray(){
        /*
        Returns a set of integers ranging from 0-6 representing the enabled days. 0=Mon, 1=Tue...5=Sat, 6=Sun
        
    return set([weekday_index for weekday_index, enabled in enumerate(self.dict.values()) if enabled])

    }
    


    public getStringArray(){
        /* --------------------------------------------------------------------------------------------
        Returns a list of strings representing the enabled weekday. 
        Eg. ['Sunday', 'Monday', 'Tuesday']
        -------------------------------------------------------------------------------------------- 
        let weekdays = [];
        for (let [day, enabled] of this.getMap()) {
            if (enabled) {
                weekdays.push(day)
            }
        } 
        return weekdays;
    }

    //Returns string representing the days of the week the task will repeat on. Eg 'Monday, Tuesday and Friday'
    public getString(){
        let weekdays = this.getStringArray();
        let weekdaysString = ""
        if (weekdays.length > 1) {
            let last_day = weekdays.pop();
            let initial_days = weekdays.join(", ");
            weekdaysString = `${initial_days} and ${last_day}`;
        } else if (weekdays.length == 1) {
            weekdaysString = weekdays[0];
        } else {
            weekdaysString = '';
        }
        return weekdaysString;    
    }

    /* --------------------------------------------------------------------------------------------
        This function gets the next possible weekday from the start date.

        It works by
        - determining the 2 valid weeks (the initial week and the intervalnumbered week)
        - going to the start of the 2 weeks (week.floor for the week start then shift one day back to include sunday)
        - shifting the week starts to enabled weekdays to get a list of possible valid weekdays.
        - Sorting the possible weekdays in both the initial week and the intervalnumbered week
        - returning the first weekday that comes after the initial date

    ---------------------------------------------------------------------------------------------
    public getNextDate(initial_date:Date, intervalnumber:number){
        
        let valid_weekdays = []

        valid_weekdays = [];
        for (week in [initial_date, addWeeks(initial_date, intervalnumber)]){
            week_start = startOfWeek(week);
            

            for weekday_number in self.arrow_set:
                valid_weekday = week_start.shift(weekday=weekday_number)
            yield valid_weekday

        }



        def generate_valid_weekdays():
            for week in [initial_date, initial_date.shift(weeks=intervalnumber)]:
                week_start = week.floor('week').shift(days=-1)
                for weekday_number in self.arrow_set:
                    valid_weekday = week_start.shift(weekday=weekday_number)
                    yield valid_weekday
        for weekday in sorted(list(generate_valid_weekdays())):
            if weekday > initial_date:
                return weekday.replace(hour=initial_date.hour, minute=initial_date.minute, second=initial_date.second)

    }
    */



}






/*
# String property --------------------------------------------------------------------------------------------------
    @property
    def string(self):

    def get_next_date(self, initial_date, intervalnumber):
        """
        This method gets the next valid weekday of the month. It does it by doing the following
        * Find the 2 valid months: the initial month and the intervalnumbered month.
        * Find all matching weekdays within the month and save to list
        * Use the ordinal as the index to the matching weekday list to get the correct weekdays for both months
        * Add the 2 correct weekdays to a final list
        * sorts the list and then chooses the soonest date that comes after the initial date
        """
        def generate_valid_weekdays():
            for month in initial_date, initial_date.shift(months=intervalnumber):
                month_start = month.floor('month')
                month_end = month.ceil('month')
                weekdays_in_this_month = [
                    day for day in month.range('day', month_start, month_end) if day.weekday() == self.weekday]
                specific_weekday = weekdays_in_this_month[self.ordinal]
                yield specific_weekday
        for weekday in sorted(list(generate_valid_weekdays())):
            if weekday > initial_date:
                return weekday.replace(hour=initial_date.hour, minute=initial_date.minute, second=initial_date.second)

                */



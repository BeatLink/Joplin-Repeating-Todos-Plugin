/* ########################################################## READ ME ####################################################################

    The recurrence logic contained in this file started out as a part of an old python todo app project of mine, this most of this code
    is in the python syntax and would need to be ported to typescript equivalents before it will be functional. Do not use any file with
    this notice.

*/



export class WeekDays {
    /* ------------------------------------------------------------------------------------------------
    Contains the resources and methods related to the weekdays used in the recurrence class for 
    weekly recurrences 
    ------------------------------------------------------------------------------------------------ */

    sunday = false;
    monday = false;
    tuesday = false;
    wednesday = false;
    thursday = false;
    friday = false;
    saturday = false;

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
    */


    public getStringArray(){
        /* --------------------------------------------------------------------------------------------
        Returns a list of strings representing the enabled weekday. 
        Eg. ['Sunday', 'Monday', 'Tuesday']
        -------------------------------------------------------------------------------------------- */
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

class WeekdayOfMonth {
    /* 
    Class that represents the specific weekday of the month the task will repeat on (eg, first sunday, last friday)
    */

    ordinal = '';   //A string representing the ordinal of the day. Valid Values: '', 'first', 'second', 'third', 'fourth', 'last'
    weekday = '';   //A string representing the day of the week. Valid values: '', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'

    public getString(){
        /* Returns a human readable string representing the weekday of the month */
        if (this.ordinal && this.weekday) {
            return `the ${this.ordinal} ${this.weekday[0].toUpperCase() + this.weekday.slice(1)}`;
        } else {
            return '';
        }
    }
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

// Stop Information #####################################################################################################
class StopInfo {
    /*
    Handles when a task should stop recurring
    The task should stop recurring if the stop date has passed, or if the stop number is 1 or less
    */

    type = 'never'  //String indicating the stop criteria. Valid Values are 'date', 'number' and 'never'
    date = null     //Date object representing the date the task should stop repeating.
    number = 1      //Integer representing the number of times before task stops repeating.
 

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
}



export class Recurrence {
    /*
    Handles all matters relating to tasks that repeat on a periodical basis
    */

    enabled = false;        // Boolean to indicate whether the task recurs or not.
    interval = 'minute';    // String representing the time interval. Valid values are 'minute', 'hour', 'day', 'week', 'month', 'year'
    intervalNumber = 1;          // Integer representing how many intervals between recurrences, eg every 5 minutes or every 2 days. Valid values are positive integers
    weekdays = new WeekDays();        //:WeekDays        // See WeekDays for more info
    weekdayOfMonth = new WeekdayOfMonth();  //:WeekdayOfMonth  // See WeekdayOfMonth for more info
    stopInfo = new StopInfo();        //:stopInfo        // See StopInfo for more info

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

class WeekDays {
    /* ------------------------------------------------------------------------------------------------
    Contains the resources and methods related to the weekdays used in the recurrence class for 
    weekly recurrences 
    ------------------------------------------------------------------------------------------------ */

    private map = new Map([
        ["Sunday", false],
        ["Monday", false],
        ["Tuesday", false],
        ["Wednesday", false],
        ["Thursday", false],
        ["Friday", false],
        ["Saturday", false]
    ]); 

    private array = Array.from(this.map.keys());

    constructor(map:Map<string, boolean>){
        this.map = map
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
        for (let [day, enabled] of this.map) {
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
        - determining the 2 valid weeks (the initial week and the incremented week)
        - going to the start of the 2 weeks (week.floor for the week start then shift one day back to include sunday)
        - shifting the week starts to enabled weekdays to get a list of possible valid weekdays.
        - Sorting the possible weekdays in both the initial week and the incremented week
        - returning the first weekday that comes after the initial date

    ---------------------------------------------------------------------------------------------
    public getNextDate(initial_date:Date, increment:number){
        
        let valid_weekdays = []

        valid_weekdays = [];
        for (week in [initial_date, addWeeks(initial_date, increment)]){
            week_start = startOfWeek(week);
            

            for weekday_number in self.arrow_set:
                valid_weekday = week_start.shift(weekday=weekday_number)
            yield valid_weekday

        }



        def generate_valid_weekdays():
            for week in [initial_date, initial_date.shift(weeks=increment)]:
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
// MonthWeekday #########################################################################################################
class WeekdayOfMonth:
    """
    Class that represents the specific weekday of the month the task will repeat on (eg, first sunday, last friday)

    ordinal: An integer representing the ordinal of the day. None=unset, 0=First, 1=Second, 2=Third, 3=Fourth, -1=Last
    weekday: An integer representing the day of the week. , None=unset, 0=monday, 1=tuesday, 2=wednesday, 3=thursday,
            4=friday, 5=saturday, 6=sunday
    """
    def __init__(self, ordinal=None, weekday=None):
        self._ordinal = None
        self._weekday = None
        self.ordinal = ordinal
        self.weekday = weekday

    # Ordinal property -------------------------------------------------------------------------------------------------
    @property
    def ordinal(self):
        return self._ordinal

    @ordinal.setter
    def ordinal(self, ordinal):
        if ordinal in (-1, 0, 1, 2, 3, None):
            self._ordinal = ordinal
        else:
            raise ValueError("Ordinal must be an integer between -1 and 3, or None to unset")

    # Weekday property -------------------------------------------------------------------------------------------------
    @property
    def weekday(self):
        return self._weekday

    @weekday.setter
    def weekday(self, weekday):
        valid_weekdays = (0, 1, 2, 3, 4, 5, 6, None)
        if weekday in valid_weekdays:
            self._weekday = weekday
        else:
            raise ValueError("Weekday must be an integer between 0-6, or None to unset")

    @property
    def dict(self):
        return {
                'ordinal': self.ordinal,
                'weekday': self.weekday
            }

    # String property --------------------------------------------------------------------------------------------------
    @property
    def string(self):
        if self.weekday is not None and self.ordinal is not None:
            ordinal = ('first', 'second', 'third', 'fourth', 'last')
            weekday = ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
            return f'the {ordinal[self.ordinal]} {weekday[self.weekday].capitalize()}'
        else:
            return ''

    def get_next_date(self, initial_date, increment):
        """
        This method gets the next valid weekday of the month. It does it by doing the following
        * Find the 2 valid months: the initial month and the incremented month.
        * Find all matching weekdays within the month and save to list
        * Use the ordinal as the index to the matching weekday list to get the correct weekdays for both months
        * Add the 2 correct weekdays to a final list
        * sorts the list and then chooses the soonest date that comes after the initial date
        """
        def generate_valid_weekdays():
            for month in initial_date, initial_date.shift(months=increment):
                month_start = month.floor('month')
                month_end = month.ceil('month')
                weekdays_in_this_month = [
                    day for day in month.range('day', month_start, month_end) if day.weekday() == self.weekday]
                specific_weekday = weekdays_in_this_month[self.ordinal]
                yield specific_weekday
        for weekday in sorted(list(generate_valid_weekdays())):
            if weekday > initial_date:
                return weekday.replace(hour=initial_date.hour, minute=initial_date.minute, second=initial_date.second)


// Stop Information #####################################################################################################
class StopInfo:
    """
    Handles when a task should stop recurring
    The task should stop recurring if the stop date has passed, or if the stop number is 1 or less

    type: String indicating the stop criteria. Valid Values are 'date', 'number' and 'never'
    date: Arrow object representing the date the task should stop repeating.
    number: Integer representing the number of times before task stops repeating.
    """

    def __init__(self, type='never', date=None, number=0):
        self.type = type
        self.date = date
        self.number = number

    @property
    def dict(self):
        return {
            'type': self.type,
            'number': self.number,
            'date': self.date
        }

    def should_stop(self):
        """Returns boolean representing whether a task should stop repeating"""
        stop_date_passed = self.type == 'date' and self.date and self.date <= arrow.now()
        stop_number_reached = self.type == 'number' and isinstance(self.number, int) and int(self.number) <= 1
        return True if stop_date_passed or stop_number_reached else False

    def update_number(self):
        if self.type == 'number' and self.number > 1:
            self.number -= 1


// Recurrence ###########################################################################################################
class Recurrence {
    /*
    Handles all matters relating to tasks that repeat on a periodical basis

    enabled: Boolean to indicate whether the task recurs or not
    interval: String representing the time interval. Valid values are 'minute', 'hour', 'day', 'week', 'month', 'year'
    increment: Integer representing the number of time intervals. Valid values are positive integers
    weekdays: See WeekDays for more info
    weekday_of_month: See WeekdayOfMonth for more info
    stop_info: see StopInfo for more info
    */

    /*

    constructor(enabled=false, interval='minute', increment=1, weekdays=null, weekday_of_month=null, stop_info=null) {
        this.enabled = enabled;
        this.interval = interval;
        this.increment = increment;
        this.weekdays = WeekDays(**weekdays) if weekdays else WeekDays();
        this.weekday_of_month = WeekdayOfMonth(**weekday_of_month) if weekday_of_month else WeekdayOfMonth()
        this.stop_info = StopInfo(**stop_info) if stop_info else StopInfo()
    }
    

    public get_next_date(initial_date) {

        """Gets the next date and time after the initial date that the task would repeat"""
        if self.enabled and initial_date <= arrow.now():
            if self.interval == 'week' and self.weekdays.arrow_set:
                new_date = self.weekdays.get_next_date(initial_date, self.increment)
            elif (
                    self.interval == 'month') and (
                    self.weekday_of_month.weekday is not None) and (
                    self.weekday_of_month.ordinal is not None):
                new_date = self.weekday_of_month.get_next_date(initial_date, self.increment)
            else:
                new_date = initial_date.shift(**{self.interval + 's': self.increment})
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
            string = f'every {str(self.increment)} {self.interval}s' if self.increment > 1 else f'every {self.interval}'
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
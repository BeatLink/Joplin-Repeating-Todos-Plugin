/* ########################################################## READ ME ####################################################################

    The recurrence logic contained in this file started out as a part of an old python todo app project of mine, this most of this code
    is in the python syntax and would need to be ported to typescript equivalents before it will be functional. Do not use any file with
    this notice.

*/


/*
class Recurrence(playhouse.signals.Model):
class Meta:
    table_name = 'recurrence'
task_id = peewee.ForeignKeyField(Task, backref="recurrence")
enabled = peewee.BooleanField(default=False)
interval = peewee.CharField(default='minute')
intervalNumber = peewee.IntegerField(default=1)


class Weekdays(playhouse.signals.Model):
class Meta:
    table_name = 'recurrence_weekdays'
recurrence_id = peewee.ForeignKeyField(Recurrence, backref="weekdays")
sunday = peewee.BooleanField(default=False)
monday = peewee.BooleanField(default=False)
tuesday = peewee.BooleanField(default=False)
wednesday = peewee.BooleanField(default=False)
thursday = peewee.BooleanField(default=False)
friday = peewee.BooleanField(default=False)
saturday = peewee.BooleanField(default=False)


class WeekdayOfMonth(playhouse.signals.Model):
class Meta:
    table_name = 'recurrence_weekday_of_month'
recurrence_id = peewee.ForeignKeyField(Recurrence, backref="weekday_of_month")
ordinal = peewee.IntegerField(null=True)
weekday = peewee.IntegerField(null=True)


class StopData(playhouse.signals.Model):
recurrence_id = peewee.ForeignKeyField(Recurrence, backref="recurrence_stop_data")
type = peewee.CharField(default='never')
date = peewee.DateTimeField(default=None, null=True)
number = peewee.IntegerField(default=0)
*/
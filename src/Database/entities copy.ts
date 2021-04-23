import { Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Recurrence {

    @PrimaryColumn()
    taskId: string;

    @Column()
    enabled: boolean;

    @Column()
    interval: string;

    @Column()
    intervalNumber: number;
}


@Entity()
export class Weekdays {

    @PrimaryColumn()
    taskId: string;

    @Column()
    sunday: boolean

    @Column()
    monday: boolean

    @Column()
    tuesday: boolean

    @Column()
    wednesday: boolean

    @Column()
    thursday: boolean

    @Column()
    friday: boolean

    @Column()
    saturday: boolean

}


@Entity()
export class WeekdayOfMonth {
    @PrimaryColumn()
    taskId: string;

    @Column()
    ordinal: string;

    @Column()
    weekday: string;
}


@Entity ()
export class StopData {
    @PrimaryColumn()
    taskId: string;

    @Column()
    type: string;

    @Column()
    date: Date;

    @Column()
    number:number;
}

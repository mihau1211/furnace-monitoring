import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToOne } from 'typeorm';
import { MonitoringData } from './MonitoringData';
import { User } from './User';

@Entity()
export class Furnace {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        unique: true
    })
    name!: string;

    @Column('float')
    minTemp!: number;

    @Column('float')
    maxTemp!: number;

    @Column()
    isFanOn!: boolean;

    @OneToMany(() => MonitoringData, monitoringData => monitoringData.furnace)
    monitoringData!: MonitoringData[];

    @ManyToOne(() => User, user => user.furnace)
    owner!: User
}

export interface FurnaceInterface {
    id?: number;
    name: string;
    minTemp: number;
    maxTemp: number;
    isFanOn?: boolean;
    monitoringData?: MonitoringData[];
    owner?: User;
    ownerId?: number;
}
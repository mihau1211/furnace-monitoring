import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MonitoringData } from './MonitoringData';

@Entity()
export class Furnace {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column('float')
    minTemp!: number;

    @Column('float')
    maxTemp!: number;

    @Column()
    isFanOn!: boolean;

    @OneToMany(() => MonitoringData, monitoringData => monitoringData.furnace)
    monitoringData!: MonitoringData[];
}

export interface FurnaceInterface {
    id?: number;
    name: string;
    minTemp: number;
    maxTemp: number;
    isFanOn?: boolean;
    monitoringData?: MonitoringData[]
}
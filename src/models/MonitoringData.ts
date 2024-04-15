import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MonitoringData {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    furnace!: string;

    @Column('float')
    temperature!: number;

    @Column('float')
    humidity!: number;

    @Column()
    timestamp!: Date;
}

export interface MonitoringDataInterface {
    id?: number;
    furnace: string;
    temperature: number;
    humidity: number;
    timestamp?: Date | number;
}
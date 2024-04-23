import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Furnace } from './Furnace';

@Entity()
export class MonitoringData {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('float')
    temperature!: number;

    @Column()
    timestamp!: Date;

    @ManyToOne(() => Furnace, furnace => furnace.monitoringData)
    furnace!: Furnace;
}

export interface MonitoringDataInterface {
    id?: number;
    furnaceId?: number;
    furnace?: Furnace;
    temperature: number;
    timestamp?: Date | number;
}
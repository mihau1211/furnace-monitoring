import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Furnace } from "./Furnace";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        unique: true
    })
    imei!: string

    @Column()
    password!: string

    @OneToMany(() => Furnace, furnace => furnace.owner)
    furnace!: Furnace[]
}

export interface UserInterface {
    id?: number;
    imei: string;
    password: string;
}
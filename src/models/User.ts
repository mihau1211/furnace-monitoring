import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToMany(() => Furnace)
    @JoinTable()
    furnaces!: Furnace[]
}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('movies')
export class MovieEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    publishingYear: number

    @Column()
    posterUrl: string
}
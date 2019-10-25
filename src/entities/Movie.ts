import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, UpdateDateColumn } from "typeorm";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 11,
        nullable: false
    })
    imdb_id: string;

    @Column({
        type: "varchar",
        length: 300,
        nullable: false
    })
    title: string;

    @Column({
        type: "varchar",
        length: 4,
        nullable: false
    })
    year: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    release: string;

    @Column({
        type: "float",
        nullable: false
    })
    rating: number;

    @UpdateDateColumn()
    lastCrawlingDate: Date;

    @CreateDateColumn()
    firstCrawlingDate: Date;
}
import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity()
export class GSEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @CreateDateColumn({
        type: 'datetime',
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'datetime',
        nullable: false,
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'datetime',
        nullable: true,
    })
    deletedAt: Date;

    @VersionColumn()
    version: number;
}
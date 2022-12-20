import { GSEntity } from "@/common/helper/gsBaseEntity";
import { Column, Entity, JoinTable, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity({ synchronize: true })
export class Profile extends GSEntity {
    @Column({ type: 'varchar' })
    public instagram: string;

    @Column({ type: 'varchar' })
    public linkedin: string;

    @Column({ type: 'varchar' })
    public github: string;

    @Column({ type: 'varchar' })
    public date_of_birth: string;

    @Column({ type: 'varchar' })
    public photo_profile_path: string;

    @Column({ type: 'varchar', unique: true })
    public phone: string;

    @Column({ type: 'varchar' })
    public cv_path: string;

    @Column({ type: 'text' })
    public description: string;

    @Column('simple-array')
    public skills: string[];

    @OneToOne(
        () => {
            return User
        },
        (user) => {
            return user.profile
        }
    )
    @JoinTable()
    user: User
}
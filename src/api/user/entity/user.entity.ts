import { Role } from '@/api/role/entities/role.entity';
import { GSEntity } from '@/common/helper/gsBaseEntity';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User extends GSEntity {
  @Column({ type: 'varchar', unique: true })
  public email!: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  public password: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar', unique: true })
  public username!: string;

  @Column({ type: "varchar", default: "ACTIVE" })
  public status: string

  @Column({ type: "varchar", nullable: true })
  public verification_email_code: string

  @Column({ type: "varchar", default: "app" })
  public social_media_login: string

  @Column({ default: false })
  verification_email_status: boolean;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  last_registration_email_send: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  last_forgot_password_email_send: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;


  // @Column('simple-array')
  // public permissions: string[];

  @ManyToOne(
    () => {
      return Role;
    },
    (role) => {
      return role.id;
    },
  )
  role: Role;

  @OneToOne(
    () => {
      return Profile
    },
    (profile) => {
      return profile.user
    }
  )
  profile: Profile
}

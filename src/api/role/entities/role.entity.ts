import { User } from '@/api/user/entity/user.entity';
import { GSEntity } from '@/common/helper/gsBaseEntity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class Role extends GSEntity {

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'boolean' })
  public status: Boolean;

  @OneToMany(
    () => {
      return User;
    },
    (users) => {
      return users.id
    }
  )
  users: User
}

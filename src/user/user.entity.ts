import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { hash } from 'bcrypt'
import { ArticleEntity } from '@app/article/article.entity'

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column({ default: '' })
  bio: string

  @Column({ default: '' })
  image: string

  @Column({ select: false })
  password: string

  @OneToMany(
    () => ArticleEntity,
    (article: ArticleEntity): UserEntity => article.author,
  )
  articles: ArticleEntity[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10)
  }
}

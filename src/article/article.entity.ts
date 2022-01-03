import {
  Column,
  CreateDateColumn,
  Entity,
  Index, JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from '@app/user/user.entity'
import { TagEntity } from '@app/tag/tag.entity'

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  slug: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  body: string

  @ManyToMany(() => TagEntity)
  @JoinTable()
  tagList: TagEntity[]

  @ManyToOne(
    () => UserEntity,
    (user: UserEntity): ArticleEntity[] => user.articles,
  )
  author: UserEntity

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

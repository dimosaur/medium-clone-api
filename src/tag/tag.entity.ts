import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  name: string
}

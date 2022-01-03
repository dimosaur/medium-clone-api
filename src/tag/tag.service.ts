import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { TagEntity } from '@app/tag/tag.entity'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagsRepository.find()
  }

  async findOrCreateTags(tagNames: string[]): Promise<TagEntity[]> {
    const tagsToInsert = tagNames.map((name) => ({ name }))

    await this.tagsRepository
      .createQueryBuilder()
      .insert()
      .values(tagsToInsert)
      .orIgnore()
      .execute()

    return this.tagsRepository.find({
      where: { name: In(tagNames) },
    })
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import slugify from 'slugify'

import { TagEntity } from '@app/tag/tag.entity'
import TagsResponseInterface from '@app/tag/types/tagsResponse.interface'

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
    tagNames = tagNames.map((name) => slugify(name, { lower: true }))
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

  buildTagsResponse(tags: TagEntity[]): TagsResponseInterface {
    return {
      tags: tags.map(({ name }: TagEntity) => name),
    }
  }
}

import { Controller, Get } from '@nestjs/common'

import { TagService } from '@app/tag/tag.service'
import TagsResponseInterface from '@app/tag/types/tagsResponse.interface'

@Controller('/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTags(): Promise<TagsResponseInterface> {
    const tags = await this.tagService.findAll()
    return this.tagService.buildTagsResponse(tags)
  }
}

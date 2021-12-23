import { Controller, Get } from '@nestjs/common'

import { TagService } from '@app/tag/tag.service'
import TagsResponse from '@app/tag/types/tagsResponse.interface'

@Controller('/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTags(): Promise<TagsResponse> {
    const tags = await this.tagService.findAll()
    return {
      tags: tags.map((tag) => tag.name),
    }
  }
}

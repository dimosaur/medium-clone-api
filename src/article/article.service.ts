import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import slugify from 'slugify'
import { ArticleEntity } from '@app/article/article.entity'
import { UserEntity } from '@app/user/user.entity'
import { CreateArticleDto } from '@app/article/dto/createArticle.dto'
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface'
import { TagService } from '@app/tag/tag.service'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly tagsService: TagService,
  ) {}

  async createArticle(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticleDto)
    article.slug = this.slugify(article.title)
    article.author = user

    if (createArticleDto?.tagList?.length) {
      article.tagList = await this.tagsService.findOrCreateTags(
        createArticleDto.tagList,
      )
    }

    return this.articleRepository.save(article)
  }

  findBySlug(slug: string): Promise<ArticleEntity> {
    return this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tagList'],
    })
  }

  private slugify(title: string): string {
    return (
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36) +
      '-' +
      slugify(title, { lower: true })
    )
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    const { tags } = this.tagsService.buildTagsResponse(article?.tagList || [])
    return {
      article: {
        ...article,
        tagList: tags,
      },
    }
  }
}

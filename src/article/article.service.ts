import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import slugify from 'slugify'
import { ArticleEntity } from '@app/article/article.entity'
import { CreateArticleDto } from '@app/article/dto/createArticle.dto'
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticleDto)
    article.slug = this.slugify(article.title)
    return this.articleRepository.save(article)
  }

  private slugify(title: string): string {
    return (
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36) +
      '-' +
      slugify(title, { lower: true })
    )
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article }
  }
}

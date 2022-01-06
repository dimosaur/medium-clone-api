import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import slugify from 'slugify'
import { ArticleEntity } from '@app/article/article.entity'
import { UserEntity } from '@app/user/user.entity'
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto'
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface'
import { TagService } from '@app/tag/tag.service'
import { ArticlesListQueryDto } from '@app/article/dto/articlesList.query.dto'
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface'
import { ArticleUpdateDto } from '@app/article/dto/articleUpdate.dto'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly tagService: TagService,
  ) {
  }

  async createArticle(
    user: UserEntity,
    createArticleDto: ArticleCreateDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticleDto)
    article.slug = this.slugify(article.title)
    article.author = user

    if (createArticleDto?.tagList?.length) {
      article.tagList = await this.tagService.findOrCreateTags(
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

  async findArticles({
                       tag,
                       author,
                       offset = 0,
                       limit = 2,
                     }: ArticlesListQueryDto): Promise<ArticleEntity[]> {
    const query = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.tagList', 'tags')
      .leftJoinAndSelect('articles.author', 'author')

    if (author) {
      query.where('author.username = :author', { author })
    }

    if (tag) {
      query
        .where('tags.name = :tag', { tag })
        .leftJoinAndSelect('articles.tagList', 'tagsList')
    }

    return query.skip(offset).take(limit).getMany()
  }

  async updateArticle(
    userId: number,
    slug: string,
    articleUpdateDto: ArticleUpdateDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug)

    if (article.author.id !== userId) {
      throw new HttpException('You are not the author', HttpStatus.FORBIDDEN)
    }

    Object.assign(article, articleUpdateDto)

    if (articleUpdateDto?.tagList) {
      if (articleUpdateDto.tagList.length) {
        article.tagList = await this.tagService.findOrCreateTags(
          articleUpdateDto.tagList,
        )
      } else {
        article.tagList = []
      }
    }

    return article
  }

  private slugify(title: string): string {
    return (
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36) +
      '-' +
      slugify(title, { lower: true })
    )
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    const { tags } = this.tagService.buildTagsResponse(article?.tagList || [])
    return {
      article: {
        ...article,
        tagList: tags,
      },
    }
  }

  buildArticlesResponse(articles: ArticleEntity[]): ArticlesResponseInterface {
    return {
      articles: articles.map((articleEntity) => {
        const { article } = this.buildArticleResponse(articleEntity)
        return article
      }),
      articlesCount: articles.length,
    }
  }
}

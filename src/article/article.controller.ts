import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ArticleService } from '@app/article/article.service'
import { AuthGuard } from '@app/user/guards/auth.guard'
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto'
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface'
import { UserEntity } from '@app/user/user.entity'
import { User } from '@app/user/decorators/user.decorator'
import { ArticlesListQueryDto } from '@app/article/dto/articlesList.query.dto'
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface'
import { ArticleUpdateDto } from '@app/article/dto/articleUpdate.dto'

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticle(
    @Body('article') createArticleDto: ArticleCreateDto,
    @User() user: UserEntity,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      user,
      createArticleDto,
    )
    return this.articleService.buildArticleResponse(article)
  }

  @Get(':slug')
  async article(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug)

    if (!article) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    return this.articleService.buildArticleResponse(article)
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async articles(
    @Query() query: ArticlesListQueryDto,
  ): Promise<ArticlesResponseInterface> {
    const articles = await this.articleService.findArticles(query)
    return this.articleService.buildArticlesResponse(articles)
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @Body('article') articleUpdateDto: ArticleUpdateDto,
    @Param('slug') slug: string,
    @User('id') userId: number,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      userId,
      slug,
      articleUpdateDto,
    )
    return this.articleService.buildArticleResponse(article)
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteArticle(@Param('slug') slug: string, @User('id') userId: number) {
    await this.articleService.deleteArticle(userId, slug)
  }
}

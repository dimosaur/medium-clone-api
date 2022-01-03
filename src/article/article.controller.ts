import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ArticleService } from '@app/article/article.service'
import { AuthGuard } from '@app/user/guards/auth.guard'
import { CreateArticleDto } from '@app/article/dto/createArticle.dto'
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface'
import { UserEntity } from '@app/user/user.entity'
import { User } from '@app/user/decorators/user.decorator'
import { ArticlesListQueryDto } from '@app/article/dto/articlesList.query.dto'

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticle(
    @Body('article') createArticleDto: CreateArticleDto,
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
  async articles(@Query() query: ArticlesListQueryDto) {
    const articles = await this.articleService.findArticles(query)
    return this.articleService.buildArticlesResponse(articles)
  }
}

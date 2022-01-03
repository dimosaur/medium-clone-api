import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ArticleService } from '@app/article/article.service'
import { AuthGuard } from '@app/user/guards/auth.guard'
import { CreateArticleDto } from '@app/article/dto/createArticle.dto'
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface'

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticle(
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(createArticleDto)
    return this.articleService.buildArticleResponse(article)
  }
}

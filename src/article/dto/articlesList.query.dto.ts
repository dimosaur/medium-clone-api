import { IsOptional, IsString } from 'class-validator'
import { ArticlesFeedQueryDto } from '@app/article/dto/articlesFeed.query.dto'

export class ArticlesListQueryDto extends ArticlesFeedQueryDto {
  @IsOptional()
  @IsString()
  tag?: string

  @IsOptional()
  @IsString()
  author?: string
}

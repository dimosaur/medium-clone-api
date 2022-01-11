import { IsInt, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class ArticlesFeedQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset: number
}

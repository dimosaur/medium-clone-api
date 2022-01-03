import { IsInt, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class ArticlesListQueryDto {
  @IsOptional()
  @IsString()
  tag: string

  @IsOptional()
  @IsString()
  author: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset: number
}

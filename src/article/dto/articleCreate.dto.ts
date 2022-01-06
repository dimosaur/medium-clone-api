import { IsNotEmpty, IsOptional } from 'class-validator'

export class ArticleCreateDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  body: string

  @IsOptional()
  @IsNotEmpty()
  tagList: string[]
}

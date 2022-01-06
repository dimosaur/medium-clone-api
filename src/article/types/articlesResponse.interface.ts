import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface'

export interface ArticlesResponseInterface {
  articles: ArticleResponseInterface['article'][]
  articlesCount: number
}

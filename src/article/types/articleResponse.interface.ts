import { ArticleEntity } from '@app/article/article.entity'

export interface ArticleResponseInterface {
  article: Omit<ArticleEntity, 'tagList'> & { tagList: string[] }
}

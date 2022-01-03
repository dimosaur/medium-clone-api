import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ArticleController } from '@app/article/article.controller'
import { ArticleService } from '@app/article/article.service'
import { ArticleEntity } from '@app/article/article.entity'
import { TagModule } from '@app/tag/tag.module'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), TagModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}

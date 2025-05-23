import { createArticleDto } from '@/article/dto/create-article.dto';
import { IArticle } from '@/article/interface/article.interface';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArticleService {
  private readonly articles: IArticle[] = [];

  createArticle(createArticleDto: createArticleDto) {
    const article: IArticle = {
      id: uuidv4(),
      ...createArticleDto,
    };
    this.articles.push(article);
    return article;
  }

  findAllArticles(): IArticle[] {
    return this.articles;
  }
}

import { createArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { IArticle } from '@/article/interface/article.interface';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArticleService {
  private articles: IArticle[] = [];

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

  findOneByParams(id: string): IArticle | undefined {
    return this.articles.find((article) => article.id === id);
  }

  updateArticle(
    article: IArticle,
    updateArticleDto: UpdateArticleDto,
  ): IArticle {
    Object.assign(article, updateArticleDto);
    return article;
  }

  deleteArticle(articleData: IArticle): void {
    this.articles = this.articles.filter(
      (article) => article.id !== articleData.id,
    );
  }
}

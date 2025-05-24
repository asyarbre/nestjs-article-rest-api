import { createArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { Article } from '@/article/entities/article.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,
  ) {}

  async createArticle(createArticleDto: createArticleDto): Promise<Article> {
    const newArticle = await this.ArticleRepository.save(createArticleDto);
    return newArticle;
  }

  async findAllArticles(): Promise<Article[]> {
    return await this.ArticleRepository.find();
  }

  async findOneByParams(id: string): Promise<Article | null> {
    return await this.ArticleRepository.findOne({
      where: { id },
    });
  }

  async updateArticle(
    article: Article,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const updatedArticle = Object.assign(article, updateArticleDto);
    return await this.ArticleRepository.save(updatedArticle);
  }

  async deleteArticle(articleData: Article): Promise<void> {
    await this.ArticleRepository.delete(articleData.id);
  }
}

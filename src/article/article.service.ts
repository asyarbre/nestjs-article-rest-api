import { createArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { Article } from '@/article/entities/article.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../common/gcs/storage.service';
import { Category } from '@/category/entities/category.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,

    @InjectRepository(Category)
    private CategoryRepository: Repository<Category>,

    private storageService: StorageService,
  ) {}

  async createArticle(
    userId: string,
    createArticleDto: createArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    let image: string | undefined;

    if (file) {
      image = await this.storageService.uploadFile(file, 'articles');
    }

    //check if category id not found throw error
    const category = await this.CategoryRepository.findOne({
      where: { id: createArticleDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newArticle = this.ArticleRepository.create({
      ...createArticleDto,
      image,
      userId,
    });

    return await this.ArticleRepository.save(newArticle);
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

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return this.storageService.uploadFile(file, 'articles');
  }
}

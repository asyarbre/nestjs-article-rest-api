import { createArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { Article } from '@/article/entities/article.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      relations: ['category', 'user'],
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    });
  }

  async updateArticle(
    userId: string,
    article: Article,
    updateArticleDto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    const currentUser = await this.ArticleRepository.findOne({
      where: { userId },
    });

    if (!currentUser) {
      throw new ForbiddenException(
        'You are not allowed to update this article',
      );
    }

    if (file) {
      article.image = await this.storageService.uploadFile(file, 'articles');
    }

    const updatedArticle = Object.assign(article, updateArticleDto);
    return await this.ArticleRepository.save(updatedArticle);
  }

  async deleteArticle(userId: string, articleData: Article): Promise<void> {
    const currentUser = await this.ArticleRepository.findOne({
      where: { userId },
    });

    if (!currentUser) {
      throw new ForbiddenException(
        'You are not allowed to delete this article',
      );
    }

    const article = await this.ArticleRepository.findOne({
      where: { id: articleData.id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.ArticleRepository.remove(article);
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return this.storageService.uploadFile(file, 'articles');
  }
}

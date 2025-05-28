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
import { ArticleQueryDto } from '@/article/dto/article-query.dto';
import { Tag } from '@/tag/entities/tag.entity';
import { ArticleTag } from '@/articleTag/entities/articletag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,

    @InjectRepository(Category)
    private CategoryRepository: Repository<Category>,

    @InjectRepository(Tag)
    private TagRepository: Repository<Tag>,

    @InjectRepository(ArticleTag)
    private ArticleTagRepository: Repository<ArticleTag>,

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

    await this.ArticleRepository.save(newArticle);

    for (const tagName of createArticleDto.tags) {
      let tag = await this.TagRepository.findOne({
        where: { name: tagName.toLocaleLowerCase() },
      });
      if (!tag) {
        tag = this.TagRepository.create({ name: tagName.toLocaleLowerCase() });
        await this.TagRepository.save(tag);
      }

      const articleTag = this.ArticleTagRepository.create({
        article: newArticle,
        tag,
      });

      await this.ArticleTagRepository.save(articleTag);
    }

    return newArticle;
  }

  async findAllArticles(query: ArticleQueryDto) {
    const {
      title,
      categoryId,
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    //pagination
    const skip = (page - 1) * limit;

    const queryBuilder = this.ArticleRepository.createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user');

    // searching
    if (title) {
      queryBuilder.andWhere('article.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    // filtering by category
    if (categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', {
        categoryId,
      });
    }

    // relations
    const [articles, total] = await queryBuilder
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)
      .select(['article', 'category.name', 'user.name', 'user.email'])
      .getManyAndCount();

    return {
      articles,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getArticleByUser(userId: string, query: ArticleQueryDto) {
    const {
      title,
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    //pagination
    const skip = (page - 1) * limit;

    const queryBuilder = this.ArticleRepository.createQueryBuilder(
      'article',
    ).innerJoinAndSelect('article.category', 'category');

    // searching
    if (title) {
      queryBuilder.andWhere('article.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    const [articles, total] = await queryBuilder
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)
      .where('article.userId = :userId', { userId })
      .select(['article', 'category.name'])
      .getManyAndCount();

    return {
      articles,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOneByParams(id: string): Promise<Article | null> {
    return await this.ArticleRepository.findOne({
      where: { id },
      relations: ['category', 'user', 'articleTags', 'articleTags.tag'],
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
        articleTags: {
          id: true,
          tag: {
            id: true,
            name: true,
          },
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

import { Article } from '@/article/entities/article.entity';
import { CreateUpdateCommentDto } from '@/comment/dto/create-update-comment.dto';
import { Comment } from '@/comment/entities/comment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private CommentRepository: Repository<Comment>,

    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,
  ) {}

  async updateOrCreateComment(
    userId: string,
    createUpdateCommentDto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    const article = await this.ArticleRepository.findOne({
      where: { id: createUpdateCommentDto.articleId },
    });
    if (!article) {
      throw new NotFoundException(
        `Article with id ${createUpdateCommentDto.articleId} not found`,
      );
    }

    const comment = await this.CommentRepository.findOne({
      where: {
        articleId: createUpdateCommentDto.articleId,
        userId: userId,
      },
    });
    if (!comment) {
      const newComment = this.CommentRepository.create({
        ...createUpdateCommentDto,
        userId: userId,
      });
      await this.CommentRepository.save(newComment);
      return { message: 'Comment created successfully' };
    } else {
      Object.assign(comment, createUpdateCommentDto);
      await this.CommentRepository.save(comment);
      return { message: 'Comment updated successfully' };
    }
  }

  async isValidComment(
    userId: string,
    articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    const comment = await this.CommentRepository.findOne({
      where: {
        articleId,
        userId,
      },
    });
    if (comment) {
      return { status: true, id: comment.id };
    } else {
      return { status: false };
    }
  }
}

import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/comment/entities/comment.entity';
import { Article } from '@/article/entities/article.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Comment, Article])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}

import { AuthGuard } from '@/auth/guard/auth.guard';
import { CommentService } from '@/comment/comment.service';
import { CreateUpdateCommentDto } from '@/comment/dto/create-update-comment.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}
@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createOrUpdateComment(
    @Request() req: AuthenticatedRequest,
    @Body() createUpdateCommentDto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    return await this.commentService.updateOrCreateComment(
      req.user.id,
      createUpdateCommentDto,
    );
  }

  @Get(':articleId')
  async isValidComment(
    @Request() req: AuthenticatedRequest,
    @Param('articleId') articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    return await this.commentService.isValidComment(req.user.id, articleId);
  }
}

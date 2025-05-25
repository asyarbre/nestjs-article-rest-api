import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard } from '@/auth/guard/auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createOrUpdateProfile(
      req.user.id,
      createProfileDto,
    );
  }
}

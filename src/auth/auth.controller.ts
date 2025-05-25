import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { User } from '@/auth/entities/user.entity';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { Request as ExpressRequest } from 'express';
import { RolesGuard } from '@/auth/guard/role.guard';
import { Roles } from '@/auth/decolators/roles.decolator';
import { Role } from '@/auth/enum/role.enum';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('getuser')
  async getUser(@Request() request: RequestWithUser): Promise<User | null> {
    return await this.authService.getUser(request.user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('test')
  getTest(): { message: string } {
    return {
      message: 'Test Role Guard',
    };
  }
}

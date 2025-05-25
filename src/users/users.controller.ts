import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@/auth/entities/user.entity';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { RolesGuard } from '@/auth/guard/role.guard';
import { Roles } from '@/auth/decolators/roles.decolator';
import { Role } from '@/auth/enum/role.enum';
import { UserFindOneParams } from '@/users/dto/find-one.params';
import { UpdateRoleDto } from '@/users/dto/update-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private async findOneOrFail(id: string): Promise<User> {
    const user = await this.usersService.findByParams(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id/role')
  async update(
    @Param() params: UserFindOneParams,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<User> {
    const user = await this.findOneOrFail(params.id);
    return await this.usersService.updateRoleUser(user, updateRoleDto);
  }
}

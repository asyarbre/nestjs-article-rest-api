import { User } from '@/auth/entities/user.entity';
import { UpdateRoleDto } from '@/users/dto/update-role.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByParams(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async updateRoleUser(
    user: User,
    updateRoleDto: UpdateRoleDto,
  ): Promise<User> {
    Object.assign(user, updateRoleDto);
    return this.userRepository.save(user);
  }
}

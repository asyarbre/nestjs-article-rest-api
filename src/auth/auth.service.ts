import { User } from '@/auth/entities/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '@/auth/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    const userEmailExists = await this.userRepository.findOneBy({
      email: registerDto.email,
    });

    if (userEmailExists) {
      throw new ConflictException(
        'Email already exists. Please use a different email.',
      );
    }

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashPassword,
    });

    await this.userRepository.save(newUser);
    return { message: 'User registered successfully' };
  }
}

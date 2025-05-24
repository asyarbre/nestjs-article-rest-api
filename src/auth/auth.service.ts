import { User } from '@/auth/entities/user.entity';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '@/auth/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }
}

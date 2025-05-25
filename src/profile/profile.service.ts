import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '@/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from '@/auth/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private repositoryProfile: Repository<Profile>,

    @InjectRepository(User)
    private repositoryUser: Repository<User>,
  ) {}

  async createOrUpdateProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<{ message: string }> {
    const user = await this.repositoryUser.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profile) {
      Object.assign(user.profile, createProfileDto);
      await this.repositoryProfile.save(user.profile);
      return {
        message: 'Profile updated successfully',
      };
    } else {
      // Create a new profile if it doesn't exist
      const profile = this.repositoryProfile.create({
        ...createProfileDto,
      });
      profile.user = user;
      await this.repositoryProfile.save(profile);
      return {
        message: 'Profile created successfully',
      };
    }
  }

  async getUserProfileByToken(userId: string): Promise<User | null> {
    const userProfile = await this.repositoryUser.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    return userProfile;
  }
}

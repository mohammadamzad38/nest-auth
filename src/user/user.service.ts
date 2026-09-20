import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto/register.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(registerDto: RegisterDto) {
    try {
      return await this.userModel.create({
        fname: registerDto.fname,
        lname: registerDto.lname,
        email: registerDto.email,
        password: registerDto.password,
      });
    } catch (err: unknown) {
      const e = err as { code?: number };
      const DUPLICATE_KEY_CODE = 11000;
      if (e.code === DUPLICATE_KEY_CODE) {
        throw new ConflictException(
          'Email is already Taken. Please use a new email',
        );
      }
    }
  }

  async findUser(email: string) {
    return await this.userModel.findOne({ email });
  }

  async getUserById(id: string){
    return await this.userModel.findOne({_id: id})
  }
}

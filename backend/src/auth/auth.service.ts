import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoggerService } from './auth.logger';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from 'src/user/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from 'src/user/dto/forgot-password-dto.dto';
import { Repository } from 'typeorm';
import { PasswordResetToken } from 'src/user/password-reset-token.entity';
import { ResetPasswordDto } from 'src/user/dto/reset-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private logger: LoggerService,
    private jwtService: JwtService,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async register(dto: CreateUserDto) {
    this.logger.log('register user');
    const user = await this.userService.findUserByEmail(dto.email);
    if (user) {
      throw new ConflictException('this email is already registered');
    }
    const newUser = await this.userService.createUser(dto);
    return newUser;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // compare the passwords
    const isSame = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isSame) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(
        'If the email is registered, a password reset link has been sent.',
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash the token
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save to PasswordResetToken
    const passwordReset = this.passwordResetTokenRepository.create({
      user: user,
      tokenHash: hashedToken,
      used: false,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    });

    await this.passwordResetTokenRepository.save(passwordReset);

    // 🔴 TEMPORARY: Log the unhashed token for testing
    console.log('=================================');
    console.log(`🔑 Reset Token for ${dto.email}: ${resetToken}`);
    console.log('=================================');
    return {
      message: 'Password reset link generated',
      resetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    /**
     *Find the reset-token records that are still potentially valid.
     Use bcrypt.compare() against the supplied token.
     Find the matching one.
     Then reset the password.
    """
     */

    const tokens = await this.passwordResetTokenRepository.find({
      where: { used: false },
      relations: {
        user: true,
      },
    });

    let foundToken: PasswordResetToken | null = null;

    for (const storedToken of tokens) {
      const isValid = await bcrypt.compare(dto.token, storedToken.tokenHash);
      if (isValid) {
        foundToken = storedToken;
        break;
      }
    }

    if (!foundToken) {
      throw new BadRequestException('Invalid Token');
    }

    if (foundToken.expiresAt < new Date()) {
      throw new BadRequestException('Token has expired');
    }
    const user = foundToken.user;
    const salt = 10;
    const hash = await bcrypt.hash(dto.password, salt);
    await this.userService.updatePassword(hash, user.id);
    foundToken.used = true;
    await this.passwordResetTokenRepository.save(foundToken);
    return {
      message: 'Password reset successfully',
    };
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { LoggerService } from './auth.logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PasswordResetToken } from 'src/user/password-reset-token.entity';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([PasswordResetToken]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LoggerService],
})
export class AuthModule {}

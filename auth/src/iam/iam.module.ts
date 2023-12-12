import { Module } from '@nestjs/common';
import { BcryptService } from './services/hashing/bcrypt.service';
import { HashingService } from './services/hashing/hashing.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthenticationController } from './services/authentication/authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/common/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionService } from './services/permission/permission.service';
import { PermissionController } from './services/permission/permission.controller';
import { ApiKeys } from './entities/api-keys.entity';
import { ApiKeysGuard } from 'src/common/guards/api-keys.guard';
import { ApiKeysService } from './services/api-keys/api-keys.service';
import { ApiKeysController } from './services/api-keys/api-keys.controller';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKeys]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    JwtGuard,
    ApiKeysGuard,
    ApiKeysService,
    AuthenticationService,
    PermissionService,
  ],
  controllers: [
    AuthenticationController,
    PermissionController,
    ApiKeysController,
  ],
})
export class IamModule {}

import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import JwtConfig from 'src/common/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtSignAction } from './types/jwt-sign-action.type';
import { RedisService } from 'src/common/modules/redis/redis.service';
import { randomUUID } from 'crypto';
import {
  REFRESH_TOKEN_ID,
  USER_INFO,
} from 'src/common/constants/redis.constants';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthenticationService {
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;
  @Inject()
  private readonly hashingService: HashingService;
  @Inject()
  private readonly jwtService: JwtService;
  @Inject(JwtConfig.KEY)
  private readonly jwtConfig: ConfigType<typeof JwtConfig>;
  @Inject()
  private readonly redisService: RedisService;

  async signUp(signUpDto: SignUpDto) {
    try {
      const { email, password } = signUpDto;
      const user = new User();
      user.email = email;
      user.password = await this.hashingService.hash(password);
      return await this.usersRepository.save(user);
    } catch (error) {
      const pgUniqueViolationError = '23505';
      if (error.code === pgUniqueViolationError) {
        throw new ConflictException('手机号已存在');
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isEqual = await this.hashingService.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException('密码错误');
    }

    const [accessToken, refreshToken] = await this.genToken(user);
    await this.redisService.redisClient.set(
      `${USER_INFO}_${user.id}`,
      JSON.stringify(user),
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    try {
      const { id, refreshTokenId } = await this.jwtService.verifyAsync(
        token,
        this.getJwtSignOptions(JwtSignAction.Refresh),
      );
      const user = await this.usersRepository.findOneByOrFail({ id });
      const cacheId = await this.redisService.redisClient.get(
        REFRESH_TOKEN_ID + user.id,
      );
      if (refreshTokenId !== cacheId) {
        throw new UnauthorizedException('token已过期');
      }
      const [accessToken, refreshToken] = await this.genToken(user);
      await this.redisService.redisClient.set(
        `${USER_INFO}_${user.id}`,
        JSON.stringify(user),
      );
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private async genToken(user: User) {
    const refreshTokenId = randomUUID();
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken(user, this.getJwtSignOptions(JwtSignAction.Sign)),
        this.signToken(user, this.getJwtSignOptions(JwtSignAction.Refresh), {
          refreshTokenId,
        }),
      ]);
      await this.redisService.redisClient.set(
        REFRESH_TOKEN_ID + user.id,
        refreshTokenId,
      );
      return [accessToken, refreshToken];
    } catch (error) {
      throw new UnauthorizedException('登陆失败');
    }
  }

  private async signToken<T extends object>(
    user: User,
    signOptions?: JwtSignOptions,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      { id: user.id, ...(payload ?? {}) },
      signOptions,
    );
  }

  private getJwtSignOptions(actionType: JwtSignAction) {
    if (actionType === JwtSignAction.Sign) {
      return {
        expiresIn: this.jwtConfig.expiresIn,
        secret: this.jwtConfig.secret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
      };
    }
    if (actionType === JwtSignAction.Refresh) {
      return {
        expiresIn: this.jwtConfig.refreshExpiresIn,
        secret: this.jwtConfig.refreshSecret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
      };
    }
  }
}

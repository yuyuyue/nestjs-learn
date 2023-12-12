import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_SECRET_REFRESH,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_IN ?? '3600', 10),
  refreshExpiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_IN ?? '86400', 10),
}));

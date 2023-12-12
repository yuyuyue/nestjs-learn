import { SetMetadata } from '@nestjs/common';

// 目前是简单做法，只有有权限控制和没权限控制
export const AuthWhitelist = () => SetMetadata('auth-whitelist', true);

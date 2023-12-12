import { Controller, Get, Inject } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  @Inject()
  private readonly permissionService: PermissionService;

  // 这里正常应该是实现角色和权限的CRUD
  @Get('/init')
  async init() {
    this.permissionService.init();
    return '初始化成功';
  }
}

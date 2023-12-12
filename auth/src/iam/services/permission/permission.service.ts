import { Inject, Injectable } from '@nestjs/common';
import { Permission } from 'src/iam/entities/permission.entity';
import { Role } from 'src/iam/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class PermissionService {
  @Inject()
  private readonly entityManager: EntityManager;

  async init() {
    const user1 = new User();
    user1.email = 'yby@163.com';
    user1.password = '111111';

    const user2 = new User();
    user2.email = 'lisi@163.com';
    user2.password = '222222';

    const user3 = new User();
    user3.email = 'wanger@163.com';
    user3.password = '333333';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.name = '新增 aaa';

    const permission2 = new Permission();
    permission2.name = '修改 aaa';

    const permission3 = new Permission();
    permission3.name = '删除 aaa';

    const permission4 = new Permission();
    permission4.name = '查询 aaa';

    const permission5 = new Permission();
    permission5.name = '新增 bbb';

    const permission6 = new Permission();
    permission6.name = '修改 bbb';

    const permission7 = new Permission();
    permission7.name = '删除 bbb';

    const permission8 = new Permission();
    permission8.name = '查询 bbb';

    role1.permissions = [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ];

    role2.permissions = [permission1, permission2, permission3, permission4];

    user1.role = [role1];

    user2.role = [role2];

    await this.entityManager.save(Permission, [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ]);

    await this.entityManager.save(Role, [role1, role2]);

    await this.entityManager.save(User, [user1, user2]);
  }
}

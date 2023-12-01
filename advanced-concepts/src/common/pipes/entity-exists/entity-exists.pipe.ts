import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Type,
  Inject,
} from '@nestjs/common';

export function EntityExistsPipe(entityCls: Type): Type<PipeTransform> {
  @Injectable()
  class EntityExistsPipeCls implements PipeTransform {
    constructor(
      @Inject(entityCls)
      private readonly entityRepository: {
        exists(condition: unknown): Promise<void>;
      },
    ) {}
    async transform(value: any, metadata: ArgumentMetadata) {
      // 判断是否存在
      await this.entityRepository.exists({ where: { id: value } });
      return value;
    }
  }
  return EntityExistsPipeCls;
}

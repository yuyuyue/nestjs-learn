import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule implements OnApplicationBootstrap {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationBootstrap() {
    const contextId = ContextIdFactory.create();
    // 可以注入到servicde中
    this.moduleRef.registerRequestByContextId({ hello: 'world' }, contextId);
    const tagsService = await this.moduleRef.resolve(TagsService, contextId);
    // console.log(tagsService, this.moduleRef);
  }
}

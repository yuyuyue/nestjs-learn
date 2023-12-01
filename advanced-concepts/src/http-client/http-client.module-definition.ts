import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: HTTP_MOUDLE_TOKEN, // 标识
  OPTIONS_TYPE, // 覆盖默认
  ASYNC_OPTIONS_TYPE, //
} = new ConfigurableModuleBuilder<{
  baseUrl?: string; // 相同配置会生成同一个module
}>({
  alwaysTransient: true, // 默认相同配置会生成同一个module，如果为true就每次new都会生成新的moudule
})
  // .setClassMethodName('forRoot') // 设置调用方式
  // .setFactoryMethodName('create') // 创建方式
  .setExtras<{
    isGlobal?: boolean;
  }>(
    // 设置额外的属性
    {
      isGlobal: true,
    },
    (definition, extras) => {
      console.log(definition, extras, 'extras');
      return {
        ...definition,
        global: extras.isGlobal,
      };
    },
  )
  .build();

// register: 特定配置的动态模块，或者只有模块调用
// forRoot: 全局只有一个的配置
// forReature: 需要动态配置的模块，比如访问什么资源库，上下文

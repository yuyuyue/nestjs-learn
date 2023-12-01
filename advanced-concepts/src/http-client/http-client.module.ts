import { DynamicModule, Inject, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  HTTP_MOUDLE_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} from './http-client.module-definition';

@Module({})
export class HttpClientModule extends ConfigurableModuleClass {
  constructor(@Inject(HTTP_MOUDLE_TOKEN) private options) {
    console.log(options, HTTP_MOUDLE_TOKEN, 'options');
    super();
  }

  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    console.log(options, 'options----');
    return super.register(options);
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.registerAsync(options),
    };
  }
}

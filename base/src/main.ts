import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptor/wrap-response/wrap-response.interceptor';
import { TimeInterceptor } from './common/interceptor/time/time.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤掉非dto的传入参数
      transform: true, // 将dto转换成正确的dto类型, 包括参数比如路径的string2number
      forbidNonWhitelisted: true, // 非白名单的参数抛出错误
      transformOptions: {
        enableImplicitConversion: true, // 参数隐式转换
      },
    }),
  );
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Coffee')
    .setDescription('Coffee App')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();

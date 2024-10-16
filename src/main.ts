import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API DocumentBuilder')
    .setDescription('API description for my application')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api-docs',app,document);
  //app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();

import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }))
  const config = new DocumentBuilder()
    .setTitle('Pam Pam Ewallet')
    .setDescription('The API for PamPam')
    .setVersion('1.0')
    .addTag('ewallet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3003);
  console.log("app is running on port 3003")
}
bootstrap();

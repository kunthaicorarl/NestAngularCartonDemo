import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
declare const module: any;
// async function bootstrap() {
// const app = await NestFactory.create(AppModule, {cors: true});
// app.listen(5000)
// .then(() => {
// console.log("successfully stared on port 5000");
// })
// .catch((error) => {
// console.log(error);
// })
// }
// bootstrap();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
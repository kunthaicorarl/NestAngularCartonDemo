import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';
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
  .setTitle('My App')
  .setDescription('My App API documentation')
  .setVersion('1.0')
  .setBasePath('api')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'access-token',
  )
  .build();



  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
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

  // const config = new DocumentBuilder()
  //   .setTitle('My App')
  //   .setDescription('My App API documentation')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build()


  // const config = new DocumentBuilder()
  // .setTitle('SWAGGER API')
  // .setVersion('1.0.0')
  // .addBearerAuth(
  //   { 
  //     // I was also testing it without prefix 'Bearer ' before the JWT
  //     description: `[just text field] Please enter token in following format: Bearer <JWT>`,
  //     name: 'Authorization',
  //     bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
  //     scheme: 'Bearer',
  //     type: 'http', // I`ve attempted type: 'apiKey' too
  //     in: 'Header'
  //   },
  //   'access_token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  // )
  // .build();
   
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
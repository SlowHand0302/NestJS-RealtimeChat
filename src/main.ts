import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@infrastructure/config/app.config';
import configSwagger from '@infrastructure/config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    configSwagger(app);
    app.enableCors();

    // setting to enable validation through class-validator
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // strips properties not in the DTO
            transform: true, // transforms payloads into DTO classes
            forbidNonWhitelisted: true, // throws an error if extra properties are present
        }),
    );

    await app.listen(appConfig.port);
    console.log(`🚀 Server running on http://localhost:${appConfig.port}`);
    console.log(`📦 Environment: ${appConfig.environment}`);
}
bootstrap();

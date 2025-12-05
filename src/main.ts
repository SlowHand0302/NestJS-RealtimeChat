import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@infrastructure/config/app.config';
import configSwagger from '@infrastructure/config/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    configSwagger(app);
    app.enableCors();

    await app.listen(appConfig.port);
    console.log(`🚀 Server running on http://localhost:${appConfig.port}`);
    console.log(`📦 Environment: ${appConfig.environment}`);
}
bootstrap();

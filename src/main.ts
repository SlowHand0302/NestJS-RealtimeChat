import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@configs/app.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    app.enableCors();

    await app.listen(appConfig.port);
    console.log(
        `Application is running on ${appConfig.environment} mode at: http://${appConfig.host}:${appConfig.port}`,
    );
}
bootstrap();

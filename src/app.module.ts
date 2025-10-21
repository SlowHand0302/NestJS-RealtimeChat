import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './common/configs/joi.schema';
import { appConfig } from '@configs/app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema: configSchema,
            cache: true,
            expandVariables: true,
            validationOptions: {
                abortEarly: true,
            },
            load: [appConfig],
        }),
        CommonModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

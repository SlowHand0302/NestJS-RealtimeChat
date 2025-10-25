import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@core/core.module';
import { AppController } from './app.controller';
import { appConfig } from '@infrastructure/config/app.config';
import { configSchema } from '@infrastructure/config/joi.schema';
import { ApplicationModule } from '@application/application.module';
import { PresentationModule } from '@presentation/presentation.module';
import { postgreSqlConfig } from '@infrastructure/config/postgreSql.config';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

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
            load: [appConfig, postgreSqlConfig],
        }),
        CoreModule,
        ApplicationModule,
        PresentationModule,
        InfrastructureModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

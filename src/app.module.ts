import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { CoreModule } from '@core/core.module';
import { AppController } from './app.controller';
import { ApplicationModule } from '@application/application.module';
import { PresentationModule } from '@presentation/presentation.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

@Module({
    imports: [CoreModule, ApplicationModule, PresentationModule, InfrastructureModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export default function configSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Real Time Chat Application')
        .setDescription('### Real Time Chat Api Description')
        .setVersion('1.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'JWT-auth', // Name for reference
        )
        .addBasicAuth()
        .addCookieAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true, // Scans deeply for nested routes (default: false)
        ignoreGlobalPrefix: false, // Include global prefix if set
    });

    // Custom Swagger UI options (e.g., custom CSS, auth)
    const swaggerCustomOptions: SwaggerCustomOptions = {
        customSiteTitle: 'Real Time Chat Application',
        swaggerOptions: {
            persistAuthorization: true, // Remembers auth token
            tagsSorter: 'alpha', // Sort tags alphabetically
            operationsSorter: 'alpha', // Sort operations alphabetically
        },
        explorer: true, // Enable Explorer mode for better navigation
    };

    SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
}

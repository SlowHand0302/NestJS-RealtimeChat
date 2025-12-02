```
project-root/
├── src/
│   ├── domain/                           # Enterprise Business Rules (innermost layer)
│   │   ├── entities/                     # Domain entities (business objects)
│   │   │   ├── user.entity.ts
│   │   │   ├── order.entity.ts
│   │   │   └── product.entity.ts
│   │   │
│   │   ├── value-objects/                # Immutable value objects
│   │   │   ├── email.vo.ts
│   │   │   ├── money.vo.ts
│   │   │   └── address.vo.ts
│   │   │
│   │   ├── repositories/                 # Repository interfaces (ports)
│   │   │   ├── user.repository.interface.ts
│   │   │   ├── order.repository.interface.ts
│   │   │   └── product.repository.interface.ts
│   │   │
│   │   ├── services/                     # Domain services (pure business logic)
│   │   │   ├── pricing.service.ts
│   │   │   └── inventory.service.ts
│   │   │
│   │   └── exceptions/                   # Domain-specific exceptions
│   │       ├── user-not-found.exception.ts
│   │       └── insufficient-stock.exception.ts
│   │
│   ├── application/                      # Application Business Rules
│   │   ├── use-cases/                    # Use cases (application services)
│   │   │   ├── user/
│   │   │   │   ├── create-user.use-case.ts
│   │   │   │   ├── update-user-name.use-case.ts
│   │   │   │   ├── delete-user.use-case.ts
│   │   │   │   └── get-user.use-case.ts
│   │   │   │
│   │   │   ├── order/
│   │   │   │   ├── create-order.use-case.ts
│   │   │   │   ├── cancel-order.use-case.ts
│   │   │   │   └── get-order-history.use-case.ts
│   │   │   │
│   │   │   └── product/
│   │   │       ├── create-product.use-case.ts
│   │   │       └── update-product-stock.use-case.ts
│   │   │
│   │   ├── dtos/                         # Application DTOs
│   │   │   ├── user/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   │
│   │   │   └── order/
│   │   │       ├── create-order.dto.ts
│   │   │       └── order-response.dto.ts
│   │   │
│   │   ├── ports/                        # Application ports (interfaces for external services)
│   │   │   ├── email.service.interface.ts
│   │   │   ├── payment.service.interface.ts
│   │   │   └── logger.interface.ts
│   │   │
│   │   ├── mappers/                      # Application layer mappers
│   │   │   ├── user.mapper.ts
│   │   │   └── order.mapper.ts
│   │   │
│   │   └── exceptions/                   # Application-specific exceptions
│   │       ├── validation.exception.ts
│   │       └── use-case.exception.ts
│   │
│   ├── infrastructure/                   # Frameworks & Drivers (outermost layer)
│   │   ├── persistence/                  # Database implementations
│   │   │   ├── typeorm/
│   │   │   │   ├── entities/             # ORM entities
│   │   │   │   │   ├── user.entity.ts
│   │   │   │   │   ├── order.entity.ts
│   │   │   │   │   └── product.entity.ts
│   │   │   │   │
│   │   │   │   ├── repositories/         # Repository implementations
│   │   │   │   │   ├── typeorm-user.repository.ts
│   │   │   │   │   ├── typeorm-order.repository.ts
│   │   │   │   │   └── typeorm-product.repository.ts
│   │   │   │   │
│   │   │   │   ├── mappers/              # ORM to Domain mappers
│   │   │   │   │   ├── user.mapper.ts
│   │   │   │   │   └── order.mapper.ts
│   │   │   │   │
│   │   │   │   ├── migrations/           # Database migrations
│   │   │   │   │   ├── 1234567890-CreateUserTable.ts
│   │   │   │   │   └── 1234567891-CreateOrderTable.ts
│   │   │   │   │
│   │   │   │   └── seeds/                # Database seeders
│   │   │   │       └── user.seeder.ts
│   │   │   │
│   │   │   └── prisma/                   # Alternative: Prisma
│   │   │       ├── schema.prisma
│   │   │       ├── repositories/
│   │   │       └── migrations/
│   │   │
│   │   ├── adapters/                     # External service adapters
│   │   │   ├── email/
│   │   │   │   ├── sendgrid.adapter.ts
│   │   │   │   └── smtp.adapter.ts
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── stripe.adapter.ts
│   │   │   │   └── paypal.adapter.ts
│   │   │   │
│   │   │   ├── cache/
│   │   │   │   └── redis.adapter.ts
│   │   │   │
│   │   │   └── queue/
│   │   │       └── bull.adapter.ts
│   │   │
│   │   ├── messaging/                    # Message broker implementations
│   │   │   ├── rabbitmq/
│   │   │   │   ├── rabbitmq.producer.ts
│   │   │   │   └── rabbitmq.consumer.ts
│   │   │   │
│   │   │   └── kafka/
│   │   │       ├── kafka.producer.ts
│   │   │       └── kafka.consumer.ts
│   │   │
│   │   ├── config/                       # Configuration
│   │   │   ├── database.config.ts
│   │   │   ├── cache.config.ts
│   │   │   ├── queue.config.ts
│   │   │   └── env.validation.ts
│   │   │
│   │   ├── guards/                       # NestJS guards
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   │
│   │   ├── interceptors/                 # NestJS interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   │
│   │   ├── filters/                      # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   │
│   │   ├── decorators/                   # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   │
│   │   └── modules/                      # Infrastructure modules
│   │       ├── database.module.ts
│   │       ├── cache.module.ts
│   │       ├── queue.module.ts
│   │       └── messaging.module.ts
│   │
│   ├── presentation/                     # Interface Adapters (Controllers, GraphQL, etc.)
│   │   ├── http/                         # REST API
│   │   │   ├── controllers/              # REST controllers
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── order.controller.ts
│   │   │   │   └── product.controller.ts
│   │   │   │
│   │   │   ├── dtos/                     # API request/response DTOs
│   │   │   │   ├── user/
│   │   │   │   │   ├── create-user-request.dto.ts
│   │   │   │   │   ├── update-user-request.dto.ts
│   │   │   │   │   └── user-response.dto.ts
│   │   │   │   │
│   │   │   │   └── order/
│   │   │   │       ├── create-order-request.dto.ts
│   │   │   │       └── order-response.dto.ts
│   │   │   │
│   │   │   ├── mappers/                  # HTTP to Application layer mappers
│   │   │   │   ├── user-http.mapper.ts
│   │   │   │   └── order-http.mapper.ts
│   │   │   │
│   │   │   └── validators/               # Custom validators
│   │   │       ├── is-strong-password.validator.ts
│   │   │       └── is-valid-email.validator.ts
│   │   │
│   │   ├── graphql/                      # GraphQL API (if needed)
│   │   │   ├── resolvers/
│   │   │   │   ├── user.resolver.ts
│   │   │   │   └── order.resolver.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── user.type.ts
│   │   │   │   └── order.type.ts
│   │   │   │
│   │   │   ├── inputs/
│   │   │   │   ├── create-user.input.ts
│   │   │   │   └── update-user.input.ts
│   │   │   │
│   │   │   └── schema.gql
│   │   │
│   │   ├── cli/                          # CLI commands (if needed)
│   │   │   └── commands/
│   │   │       └── seed-database.command.ts
│   │   │
│   │   └── websocket/                    # WebSocket gateways (if needed)
│   │       └── gateways/
│   │           └── notifications.gateway.ts
│   │
│   ├── modules/                          # Feature modules (organizing layers)
│   │   ├── user/
│   │   │   └── user.module.ts            # Binds all user-related dependencies
│   │   │
│   │   ├── order/
│   │   │   └── order.module.ts
│   │   │
│   │   ├── product/
│   │   │   └── product.module.ts
│   │   │
│   │   └── shared/
│   │       └── shared.module.ts
│   │
│   ├── shared/                           # Shared utilities (use sparingly)
│   │   ├── utils/
│   │   │   ├── date.util.ts
│   │   │   └── string.util.ts
│   │   │
│   │   ├── constants/
│   │   │   └── app.constants.ts
│   │   │
│   │   └── types/
│   │       └── common.types.ts
│   │
│   ├── app.module.ts                     # Root application module
│   └── main.ts                           # Application entry point
│
├── test/                                 # Testing
│   ├── unit/                             # Unit tests
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── services/
│   │   │
│   │   └── application/
│   │       └── use-cases/
│   │
│   ├── integration/                      # Integration tests
│   │   ├── repositories/
│   │   └── use-cases/
│   │
│   ├── e2e/                              # End-to-end tests
│   │   ├── user.e2e-spec.ts
│   │   └── order.e2e-spec.ts
│   │
│   └── fixtures/                         # Test fixtures and mocks
│       └── user.fixture.ts
│
├── docs/                                 # Documentation
│   ├── architecture.md
│   ├── api.md
│   └── setup.md
│
├── scripts/                              # Utility scripts
│   ├── seed.ts
│   └── migrate.ts
│
├── .env.example                          # Environment variables template
├── .env.development
├── .env.production
├── .eslintrc.js                          # ESLint configuration
├── .prettierrc                           # Prettier configuration
├── tsconfig.json                         # TypeScript configuration
├── nest-cli.json                         # NestJS CLI configuration
├── package.json
├── docker-compose.yml                    # Docker services
├── Dockerfile
└── README.md
```
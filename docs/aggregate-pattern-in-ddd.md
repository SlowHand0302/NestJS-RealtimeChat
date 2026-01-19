# Domain-Driven Design: Aggregate Pattern

## Table of Contents

1. [What is an Aggregate?](#what-is-an-aggregate)
2. [Key Concepts](#key-concepts)
3. [Core Principles](#core-principles)
4. [Why Use Aggregates?](#why-use-aggregates)
5. [Aggregate Structure](#aggregate-structure)
6. [Complete TypeScript/NestJS Example](#complete-typescriptnestjs-example)
7. [The Marker Interface Pattern](#the-marker-interface-pattern)
8. [Best Practices](#best-practices)
9. [Common Mistakes](#common-mistakes)

---

## What is an Aggregate?

An **Aggregate** is a cluster of domain objects (entities and value objects) that are treated as a single unit for data changes. It's one of the most important tactical patterns in Domain-Driven Design (DDD).

Think of an aggregate as a **consistency boundary** that groups related objects together and ensures all business rules are enforced when changes occur.

---

## Key Concepts

### Aggregate Root

- The **primary entity** that serves as the entry point to the aggregate
- All external access to objects within the aggregate **must go through the root**
- Acts as a **gatekeeper** that enforces business rules
- Has a unique identity

### Consistency Boundary

- The aggregate defines a **consistency boundary**
- All invariants (business rules) within the aggregate must be satisfied when any transaction completes
- Changes are **atomic** - they all succeed or all fail together

### Transactional Boundary

- One aggregate = one transaction
- Changes to multiple aggregates require multiple transactions (eventual consistency)

---

## Core Principles

### 1. Reference by ID Only

```typescript
// ✅ CORRECT: Reference other aggregates by ID
class Order {
    constructor(
        public readonly id: string,
        public readonly customerId: string, // Just the ID
    ) {}
}

// ❌ WRONG: Direct object reference
class Order {
    constructor(
        public readonly id: string,
        public readonly customer: Customer, // Don't do this!
    ) {}
}
```

### 2. Keep Aggregates Small

- Only include what needs to be consistent together
- Large aggregates = performance issues and complexity
- If objects can change independently, they should be separate aggregates

### 3. Enforce Invariants

- All business rules are enforced within the aggregate boundary
- The aggregate root is responsible for maintaining consistency

### 4. One Repository Per Aggregate

```typescript
// ✅ CORRECT: Repository for aggregate root
class OrderRepository {
    save(order: Order): Promise<void>;
    findById(id: string): Promise<Order | null>;
}

// ❌ WRONG: Repository for internal entity
class OrderLineRepository {
    // Don't create this!
    save(orderLine: OrderLine): Promise<void>;
}
```

### 5. Modifications Through Root

- External code cannot directly modify entities inside the aggregate
- All changes must go through the aggregate root's public methods

---

## Why Use Aggregates?

### Problem Without Aggregates

```typescript
// ❌ BAD: Direct modification bypasses business rules
const order = await orderRepository.findById(orderId);
const orderLine = order.lines[0];
orderLine.changeQuantity(-5); // Violates invariants!
// Order doesn't know this happened and can't enforce rules
```

### Solution With Aggregates

```typescript
// ✅ GOOD: Modification through aggregate root
const order = await orderRepository.findById(orderId);
order.changeLineQuantity(productId, 5);
// The Order validates:
// - Is the order still modifiable?
// - Is the quantity valid?
// - Does this product exist?
await orderRepository.save(order);
```

---

## Aggregate Structure

```
┌─────────────────────────────────────────┐
│         Order Aggregate                 │
│                                         │
│  ┌─────────────────────────────┐       │
│  │   Order (Aggregate Root)    │       │
│  │   - id                      │       │
│  │   - customerId              │       │
│  │   - status                  │       │
│  │   + addLine()              │       │
│  │   + confirm()              │       │
│  └─────────────────────────────┘       │
│           │                             │
│           │ controls                    │
│           ▼                             │
│  ┌─────────────────────────────┐       │
│  │   OrderLine (Entity)        │       │
│  │   - productId               │       │
│  │   - quantity                │       │
│  │   - unitPrice               │       │
│  └─────────────────────────────┘       │
│           │                             │
│           │ uses                        │
│           ▼                             │
│  ┌─────────────────────────────┐       │
│  │   Money (Value Object)      │       │
│  │   - amount                  │       │
│  │   - currency                │       │
│  └─────────────────────────────┘       │
│                                         │
└─────────────────────────────────────────┘
         ▲
         │ External code can only
         │ access through here
```

---

## Complete TypeScript/NestJS Example

### Value Objects

```typescript
// domain/value-objects/money.ts
export class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: string,
    ) {
        if (amount < 0) throw new Error('Amount cannot be negative');
    }

    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    multiply(factor: number): Money {
        return new Money(this.amount * factor, this.currency);
    }
}

// domain/value-objects/product-id.ts
export class ProductId {
    constructor(public readonly value: string) {
        if (!value) throw new Error('ProductId cannot be empty');
    }
}
```

### Entity (Inside Aggregate)

```typescript
// domain/order/order-line.entity.ts
export class OrderLine {
    constructor(
        public readonly productId: ProductId,
        private _quantity: number,
        public readonly unitPrice: Money,
    ) {
        this.validateQuantity(_quantity);
    }

    get quantity(): number {
        return this._quantity;
    }

    get totalPrice(): Money {
        return this.unitPrice.multiply(this._quantity);
    }

    changeQuantity(newQuantity: number): void {
        this.validateQuantity(newQuantity);
        this._quantity = newQuantity;
    }

    private validateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
    }
}
```

### Aggregate Root

```typescript
// domain/order/order.entity.ts
export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    CANCELLED = 'CANCELLED',
}

export class Order implements IAggregateRoot {
    private _lines: OrderLine[] = [];
    private _status: OrderStatus = OrderStatus.PENDING;
    private readonly MAX_TOTAL = 10000; // Business rule

    constructor(
        public readonly id: string,
        public readonly customerId: string, // Reference by ID only
        private readonly createdAt: Date = new Date(),
    ) {}

    // Read-only access to internal entities
    get lines(): readonly OrderLine[] {
        return [...this._lines]; // Return copy to prevent external modification
    }

    get status(): OrderStatus {
        return this._status;
    }

    get total(): Money {
        if (this._lines.length === 0) {
            return new Money(0, 'USD');
        }
        return this._lines.reduce((sum, line) => sum.add(line.totalPrice), new Money(0, 'USD'));
    }

    // Business logic methods - enforce invariants
    addLine(productId: ProductId, quantity: number, unitPrice: Money): void {
        this.ensureOrderIsModifiable();

        const existingLine = this._lines.find((line) => line.productId.value === productId.value);

        if (existingLine) {
            existingLine.changeQuantity(existingLine.quantity + quantity);
        } else {
            this._lines.push(new OrderLine(productId, quantity, unitPrice));
        }

        // Enforce cross-entity invariant
        if (this.total.amount > this.MAX_TOTAL) {
            // Rollback
            if (existingLine) {
                existingLine.changeQuantity(existingLine.quantity - quantity);
            } else {
                this._lines.pop();
            }
            throw new Error(`Order total cannot exceed $${this.MAX_TOTAL}`);
        }
    }

    removeLineByProductId(productId: ProductId): void {
        this.ensureOrderIsModifiable();
        this._lines = this._lines.filter((line) => line.productId.value !== productId.value);
    }

    changeLineQuantity(productId: ProductId, newQuantity: number): void {
        this.ensureOrderIsModifiable();

        const line = this._lines.find((line) => line.productId.value === productId.value);

        if (!line) {
            throw new Error('Order line not found');
        }

        const oldQuantity = line.quantity;
        line.changeQuantity(newQuantity);

        // Enforce cross-entity invariant
        if (this.total.amount > this.MAX_TOTAL) {
            line.changeQuantity(oldQuantity); // Rollback
            throw new Error(`Order total cannot exceed $${this.MAX_TOTAL}`);
        }
    }

    confirm(): void {
        if (this._status !== OrderStatus.PENDING) {
            throw new Error('Only pending orders can be confirmed');
        }
        if (this._lines.length === 0) {
            throw new Error('Cannot confirm an empty order');
        }
        this._status = OrderStatus.CONFIRMED;
    }

    ship(): void {
        if (this._status !== OrderStatus.CONFIRMED) {
            throw new Error('Only confirmed orders can be shipped');
        }
        this._status = OrderStatus.SHIPPED;
    }

    cancel(): void {
        if (this._status === OrderStatus.SHIPPED) {
            throw new Error('Cannot cancel a shipped order');
        }
        this._status = OrderStatus.CANCELLED;
    }

    private ensureOrderIsModifiable(): void {
        if (this._status !== OrderStatus.PENDING) {
            throw new Error('Cannot modify a non-pending order');
        }
    }
}
```

### Repository

```typescript
// infrastructure/repositories/order.repository.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository {
    private orders: Map<string, Order> = new Map();

    async save(order: Order): Promise<void> {
        // In real app, persist to database
        // Save the entire aggregate as one transaction
        this.orders.set(order.id, order);
    }

    async findById(id: string): Promise<Order | null> {
        // Load the entire aggregate
        return this.orders.get(id) || null;
    }

    async findByCustomerId(customerId: string): Promise<Order[]> {
        return Array.from(this.orders.values()).filter((order) => order.customerId === customerId);
    }

    async delete(id: string): Promise<void> {
        this.orders.delete(id);
    }
}
```

### Application Service

```typescript
// application/services/order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {}

    async createOrder(customerId: string): Promise<string> {
        const order = new Order(uuidv4(), customerId);
        await this.orderRepository.save(order);
        return order.id;
    }

    async addProductToOrder(orderId: string, productId: string, quantity: number, price: number): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Aggregate enforces all invariants
        order.addLine(new ProductId(productId), quantity, new Money(price, 'USD'));

        await this.orderRepository.save(order);
    }

    async changeProductQuantity(orderId: string, productId: string, newQuantity: number): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.changeLineQuantity(new ProductId(productId), newQuantity);
        await this.orderRepository.save(order);
    }

    async confirmOrder(orderId: string): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.confirm();
        await this.orderRepository.save(order);
    }

    async getOrderTotal(orderId: string): Promise<number> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order.total.amount;
    }
}
```

### Controller

```typescript
// presentation/controllers/order.controller.ts
import { Controller, Post, Put, Get, Body, Param } from '@nestjs/common';

class CreateOrderDto {
    customerId: string;
}

class AddProductDto {
    productId: string;
    quantity: number;
    price: number;
}

class ChangeQuantityDto {
    quantity: number;
}

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    async createOrder(@Body() dto: CreateOrderDto) {
        const orderId = await this.orderService.createOrder(dto.customerId);
        return { orderId };
    }

    @Post(':id/lines')
    async addProduct(@Param('id') orderId: string, @Body() dto: AddProductDto) {
        await this.orderService.addProductToOrder(orderId, dto.productId, dto.quantity, dto.price);
        return { message: 'Product added successfully' };
    }

    @Put(':id/lines/:productId')
    async changeQuantity(
        @Param('id') orderId: string,
        @Param('productId') productId: string,
        @Body() dto: ChangeQuantityDto,
    ) {
        await this.orderService.changeProductQuantity(orderId, productId, dto.quantity);
        return { message: 'Quantity updated successfully' };
    }

    @Put(':id/confirm')
    async confirmOrder(@Param('id') orderId: string) {
        await this.orderService.confirmOrder(orderId);
        return { message: 'Order confirmed' };
    }

    @Get(':id/total')
    async getTotal(@Param('id') orderId: string) {
        const total = await this.orderService.getOrderTotal(orderId);
        return { total };
    }
}
```

### Module

```typescript
// order.module.ts
import { Module } from '@nestjs/common';
import { OrderService } from './application/services/order.service';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { OrderController } from './presentation/controllers/order.controller';

@Module({
    controllers: [OrderController],
    providers: [OrderService, OrderRepository],
    exports: [OrderService],
})
export class OrderModule {}
```

---

## The Marker Interface Pattern

### Why Use IAggregateRoot?

The `IAggregateRoot` interface is a **marker interface** (bookmark) that:

1. Highlights which entities should have repositories
2. Enforces architectural rules at compile-time
3. Serves as documentation
4. Prevents creating repositories for non-aggregate entities

### Basic Marker Interface

```typescript
// domain/common/aggregate-root.interface.ts
export interface IAggregateRoot {
    // Often completely empty
    // Just marks the entity as an aggregate root
}

// Usage
export class Order implements IAggregateRoot {
    // ... implementation
}

export class Customer implements IAggregateRoot {
    // ... implementation
}

// Regular entities DON'T implement it
export class OrderLine {
    // No IAggregateRoot - this is NOT a root
}
```

### Generic Repository Pattern

```typescript
// domain/common/base-repository.interface.ts
export interface IRepository<T extends IAggregateRoot> {
    save(entity: T): Promise<void>;
    findById(id: string): Promise<T | null>;
    delete(id: string): Promise<void>;
}

// ✅ CORRECT: Order is an aggregate root
export class OrderRepository implements IRepository<Order> {
    // TypeScript allows this because Order implements IAggregateRoot
    async save(order: Order): Promise<void> {
        /* ... */
    }
    async findById(id: string): Promise<Order | null> {
        /* ... */
    }
    async delete(id: string): Promise<void> {
        /* ... */
    }
}

// ❌ COMPILATION ERROR: OrderLine is not an aggregate root
export class OrderLineRepository implements IRepository<OrderLine> {
    // TypeScript error: OrderLine doesn't implement IAggregateRoot
    // This prevents you from creating repositories for non-roots!
}
```

### Advanced: With Domain Events

```typescript
// domain/common/aggregate-root.base.ts
export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}

// domain/order/events/order-confirmed.event.ts
export class OrderConfirmedEvent implements DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}

// Usage in aggregate
export class Order extends AggregateRoot {
  confirm(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be confirmed');
    }
    this._status = OrderStatus.CONFIRMED;

    // Raise domain event
    this.addDomainEvent(
      new OrderConfirmedEvent(this.id, this.customerId)
    );
  }
}

// In application service
async confirmOrder(orderId: string): Promise<void> {
  const order = await this.orderRepository.findById(orderId);
  order.confirm();
  await this.orderRepository.save(order);

  // Publish domain events
  for (const event of order.domainEvents) {
    await this.eventBus.publish(event);
  }
  order.clearDomainEvents();
}
```

---

## Best Practices

### 1. Design Aggregates Around Invariants

```typescript
// ✅ GOOD: Objects that must be consistent together
class Order {
    private _lines: OrderLine[];
    // Order and OrderLines must stay consistent
    // They belong in the same aggregate
}

// ❌ BAD: Including unrelated objects
class Order {
    private _lines: OrderLine[];
    private _customer: Customer; // Customer can change independently
    // Customer should be a separate aggregate
}
```

### 2. Keep Aggregates Small

```typescript
// ✅ GOOD: Small, focused aggregate
class Order {
    id: string;
    customerId: string; // Just ID reference
    lines: OrderLine[];
}

// ❌ BAD: Large aggregate with everything
class Order {
    id: string;
    customer: Customer; // Full object
    lines: OrderLine[];
    payments: Payment[];
    shipments: Shipment[];
    invoices: Invoice[];
    // Too much! Split into multiple aggregates
}
```

### 3. Reference Other Aggregates by ID

```typescript
// ✅ GOOD
class Order {
    constructor(
        public readonly customerId: string,
        public readonly productIds: string[],
    ) {}
}

// ❌ BAD
class Order {
    constructor(
        public readonly customer: Customer,
        public readonly products: Product[],
    ) {}
}
```

### 4. Use Eventually Consistent Between Aggregates

```typescript
// When Order is confirmed, update inventory in Product aggregate
// These are separate transactions

// Transaction 1: Confirm order
const order = await orderRepository.findById(orderId);
order.confirm();
await orderRepository.save(order);
await eventBus.publish(new OrderConfirmedEvent(order.id));

// Transaction 2: Handle event and update inventory (separate aggregate)
@EventHandler(OrderConfirmedEvent)
async handle(event: OrderConfirmedEvent) {
  const order = await orderRepository.findById(event.orderId);
  for (const line of order.lines) {
    const product = await productRepository.findById(line.productId);
    product.decreaseStock(line.quantity);
    await productRepository.save(product);
  }
}
```

### 5. Load Entire Aggregate

```typescript
// ✅ GOOD: Load complete aggregate
async findById(id: string): Promise<Order | null> {
  const orderData = await this.db.orders.findOne({ id });
  if (!orderData) return null;

  const linesData = await this.db.orderLines.find({ orderId: id });

  // Reconstruct full aggregate
  return this.mapper.toDomain(orderData, linesData);
}

// ❌ BAD: Lazy loading parts
async findById(id: string): Promise<Order | null> {
  return await this.db.orders.findOne({ id });
  // Missing order lines!
}
```

---

## Common Mistakes

### ❌ Mistake 1: Creating Repositories for Non-Roots

```typescript
// Don't do this!
class OrderLineRepository {
    save(line: OrderLine): Promise<void>;
    findById(id: string): Promise<OrderLine>;
}
```

### ❌ Mistake 2: Bypassing Aggregate Root

```typescript
// Don't do this!
const order = await orderRepo.findById(orderId);
order.lines[0].quantity = 10; // Direct modification
```

### ❌ Mistake 3: Making Aggregates Too Large

```typescript
// Don't do this!
class Customer {
    orders: Order[]; // Hundreds of orders
    payments: Payment[]; // Thousands of payments
    addresses: Address[];
    preferences: Preferences[];
    // Performance nightmare!
}
```

### ❌ Mistake 4: Referencing Other Aggregates Directly

```typescript
// Don't do this!
class Order {
    customer: Customer; // Direct reference to another aggregate
    product: Product; // Direct reference to another aggregate
}
```

### ❌ Mistake 5: Not Enforcing Invariants

```typescript
// Don't do this!
class Order {
    addLine(line: OrderLine) {
        this.lines.push(line);
        // Missing validation!
        // Not checking order status
        // Not checking total limit
    }
}
```

---

## Summary

**An Aggregate is:**

- A consistency boundary grouping related objects
- Protected by an aggregate root that enforces all business rules
- Loaded and saved as a single unit
- Referenced from outside only by ID
- The unit of transactional consistency

**Key Rules:**

1. One repository per aggregate
2. All changes through the aggregate root
3. Reference other aggregates by ID only
4. Keep aggregates small and focused
5. Design around invariants

**Benefits:**

- ✅ Enforces business rules consistently
- ✅ Clear transactional boundaries
- ✅ Prevents data corruption
- ✅ Simplifies domain model
- ✅ Improves maintainability

The aggregate pattern is fundamental to building a robust, maintainable domain model in DDD!

import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FieldOrder, FilterCondition } from '@core/criteria/criteria';
export interface FilterOptions<T extends AggregateRoot, K extends keyof T> {
    take: number;
    skip: number;
    orderBy: FieldOrder<T>;
    filter: FilterCondition<T, K>;
    search?: Partial<Record<K, string>>;
}
export interface IBaseRepository<T extends AggregateRoot> {
    findById(id: IdentifierVO): Promise<T | null>;
    findAll(options?: FilterOptions<T, keyof T>): Promise<T[]>;
    findOne(where?: FilterCondition<T, keyof T>): Promise<T | null>;
    save(entity: T): Promise<void>;
    create(entity: T): Promise<void>;
    createMany(entities: T[]): Promise<void>;
    update(id: IdentifierVO, entity: T): Promise<void>;
    updateMany(where: FilterCondition<T, keyof T>, entity: T): Promise<void>;
    delete(id: IdentifierVO): Promise<void>;
    deleteMany(where: FilterCondition<T, keyof T>): Promise<void>;
    count(where?: FilterCondition<T, keyof T>): Promise<number>;
    exists(where: FilterCondition<T, keyof T>): Promise<boolean>;
}

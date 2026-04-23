import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FieldOrder, FilterCondition } from '@core/criteria/criteria';
export interface FilterUserOptions<T extends AggregateRoot, K extends keyof T> {
    take: number;
    skip: number;
    orderBy: FieldOrder<T>;
    filter: FilterCondition<T, K>;
    search?: Partial<Record<K, string>>;
}
export interface IBaseRepository<T extends AggregateRoot> {
    findById(id: IdentifierVO): Promise<T | null>;
    findAll(options?: FilterCondition<T, keyof T>): Promise<T[]>;
    findOne(options?: FilterCondition<T, keyof T>): Promise<T | null>;
    findManyAndCount(options?: FilterCondition<T, keyof T>): Promise<[T[], number]>;
    save(entity: T): Promise<void>;
    create(entity: T): Promise<void>;
    createMany(entities: T[]): Promise<void>;
    update(id: IdentifierVO, entity: T): Promise<void>;
    updateMany(where: FilterCondition<T, keyof T>, data: Partial<T>): Promise<void>;
    delete(id: IdentifierVO): Promise<void>;
    deleteMany(where: FilterCondition<T, keyof T>): Promise<void>;
    count(where?: FilterCondition<T, keyof T>): Promise<number>;
    exists(where: FilterCondition<T, keyof T>): Promise<boolean>;
}

import { QueryOptions } from './query-options.repository';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';

export interface IBaseRepository<T extends AggregateRoot> {
    findById(id: string): Promise<T | null>;
    findAll(options?: QueryOptions): Promise<T[]>;
    findOne(options?: QueryOptions): Promise<T | null>;
    findManyAndCount(options?: QueryOptions<T>): Promise<[T[], number]>;
    save(entity: Partial<T>): Promise<T>;
    createMany(entities: Partial<T>[]): Promise<T[]>;
    update(id: string, entity: Partial<T>): Promise<T>;
    updateMany(where: Record<string, unknown>, data: Partial<T>): Promise<number>;
    delete(id: string): Promise<void>;
    deleteMany(where: Record<string, unknown>): Promise<number>;
    count(where?: Record<string, unknown>): Promise<number>;
    exists(where: Record<string, unknown>): Promise<boolean>;
}

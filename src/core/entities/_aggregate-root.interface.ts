/**
 * Marker interface for Aggregate Roots in DDD.
 * Ensures only roots have repositories and enforces consistency boundaries.
 */

import { BaseEntity } from './_base.entity';

export abstract class AggregateRoot<Props = unknown> extends BaseEntity<Props> {}

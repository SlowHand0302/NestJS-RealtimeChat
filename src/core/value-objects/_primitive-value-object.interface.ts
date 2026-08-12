/**
 * Marker interface for value objects that wrap exactly ONE primitive value
 * (e.g. IdentifierVO wraps a single UUID string).
 *
 * WHY THIS EXISTS:
 * PrismaQueryMapper builds `where` clauses from FilterCondition values. When
 * a filter's value is a value object (e.g. filtering Device.id by an
 * IdentifierVO), Prisma has no idea what to do with that object — it needs
 * the raw primitive (the UUID string), not the VO wrapper.
 *
 * A VO implements this interface to explicitly declare "I can be reduced to
 * one primitive value, safe to use directly in a DB filter." PrismaQueryMapper
 * checks for this interface and unwraps automatically — see its `toPrismaWhere`
 * implementation.
 *
 * DO NOT implement this on multi-field value objects (e.g. DeviceIdentityVO,
 * ConnectionInfoVO). There's no single correct primitive to extract from a
 * VO with more than one field, and a DB column is scalar — a multi-field VO
 * was never valid as a filter value to begin with (the FieldFilter<T[P]>
 * typing in criteria.ts already prevents this at compile time for typed
 * call sites).
 */
export interface PrimitiveValueObject<P> {
    readonly primitiveValue: P;
}

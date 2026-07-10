import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '@infrastructure/casl/policy-handler.interface';

export const VERIFY_POLICIES_KEY = 'verify-policies';

export const VerifyPolicies = (...handlers: PolicyHandler[]) => SetMetadata(VERIFY_POLICIES_KEY, handlers);

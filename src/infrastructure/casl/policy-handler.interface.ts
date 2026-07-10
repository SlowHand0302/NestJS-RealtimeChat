import { PolicyContext } from './policy-context.interface';

export interface IPolicyHandler {
    handle(context: PolicyContext): boolean | Promise<boolean>;
}

export type PolicyHandlerCallback = (context: PolicyContext) => boolean | Promise<boolean>;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export class UseCaseInput {}
export class UseCaseOutput {}

export abstract class BaseUseCase<Input extends UseCaseInput, Output extends UseCaseOutput | void> {
    abstract execute(input: Input, options: unknown): Promise<Output>;
}

export abstract class BaseValueObject<Props = unknown>{
    public readonly props : Readonly<Props>;

    constructor(props: Props){
        this.props = Object.freeze(props);
    }

    public equals(vo?: BaseValueObject<Props>): boolean{
        if (!vo || !vo.props) {
            return false;
        }
        // TODO: install lodash to use shallow comparison
        return this.props === vo.props
    }
}
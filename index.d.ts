declare class RootSiblings {
    constructor(el: JSX.Element, callback?: Function, store?: Object);

    update(el: JSX.Element, callback?: Function, store?: Object): void;

    destroy(callback?: Function): void;
}

export = RootSiblings;

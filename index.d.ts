declare class RootSiblings {
    constructor(el: JSX.Element, callback?: Function, store?: Object);

    update(el: JSX.Element, callback?: Function, store?: Object): void;

    destory(callback?: Function): void;
}

export = RootSiblings;

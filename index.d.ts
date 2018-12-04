declare class RootSiblings {
    constructor(el: JSX.Element, callback?: () => void, store?: object);

    update(el: JSX.Element, callback?: () => void, store?: object): void;

    destroy(callback?: () => void): void;
}

export = RootSiblings;

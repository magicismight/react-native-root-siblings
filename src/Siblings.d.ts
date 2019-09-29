declare class RootSiblings {
  constructor(el: JSX.Element, callback?: () => void);

  update(el: JSX.Element, callback?: () => void): void;

  destroy(callback?: () => void): void;
}

export = RootSiblings;

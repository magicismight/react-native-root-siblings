import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';

import ChildrenWrapper from './ChildrenWrapper';
import wrapRootComponent from './wrapRootComponent';

let siblingWrapper: (sibling: ReactNode) => ReactNode = sibling => sibling;

function renderSibling(sibling: ReactNode): ReactNode {
  return siblingWrapper(sibling);
}

if (!global.__rootSiblingsInjected && !global.__rootSiblingsDisabled) {
  AppRegistry.setWrapperComponentProvider(() => {
    return Root;
  });
  global.__rootSiblingsInjected = true;
}

export function setSiblingWrapper(wrapper: (sibling: ReactNode) => ReactNode) {
  siblingWrapper = wrapper;
}

const { Root, manager: rootManager } = wrapRootComponent(
  ChildrenWrapper,
  renderSibling
);
let uuid: number = 0;
const managerStack = [rootManager];
let currentManager = rootManager;

export default class RootSiblingsManager {
  private id: string;

  constructor(element: ReactNode, callback?: () => void) {
    this.id = `root-sibling-${uuid + 1}`;
    currentManager.update(this.id, element, callback);
    uuid++;
  }

  public update(element: ReactNode, callback?: () => void) {
    currentManager.update(this.id, element, callback);
  }

  public destroy(callback?: () => void) {
    currentManager.destroy(this.id, callback);
  }
}

export function RootSiblingParent(props: { children: ReactNode }) {
  const [SiblingParent, setSiblingParent] = useState<null | FunctionComponent>(
    null
  );

  useEffect(() => {
    return () => {
      managerStack.pop();
      currentManager = managerStack[managerStack.length - 1];
    };
  }, []);

  if (!SiblingParent) {
    const { Root: Parent, manager: parentManager } = wrapRootComponent(
      ChildrenWrapper,
      renderSibling
    );

    currentManager = parentManager;
    managerStack.push(parentManager);
    setSiblingParent(Parent);

    return <Parent>{props.children}</Parent>;
  } else {
    return <SiblingParent>{props.children}</SiblingParent>;
  }
}

export function RootSiblingPortal(props: { children: ReactNode }) {
  const [sibling, setSibling] = useState<null | RootSiblingsManager>(null);

  if (!sibling) {
    setSibling(new RootSiblingsManager(props.children));
  } else {
    sibling.update(props.children);
  }

  useEffect(() => {
    if (sibling) {
      return () => sibling.destroy();
    }
  }, [sibling]);

  return null;
}

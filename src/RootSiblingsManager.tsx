import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState
} from 'react';
import { AppRegistry } from 'react-native';

import ChildrenWrapper from './ChildrenWrapper';
import wrapRootComponent, { RootSiblingManager } from './wrapRootComponent';

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

const { Root, manager: defaultManager } = wrapRootComponent(
  ChildrenWrapper,
  renderSibling
);
let uuid: number = 0;
const managerStack: RootSiblingManager[] = [defaultManager];
const inactiveManagers: Set<RootSiblingManager> = new Set();

function getActiveManager(): RootSiblingManager {
  for (let i = managerStack.length - 1; i >= 0; i--) {
    const manager = managerStack[i];
    if (!inactiveManagers.has(manager)) {
      return manager;
    }
  }

  return defaultManager;
}

export default class RootSiblingsManager {
  private id: string;
  private manager: RootSiblingManager;

  constructor(element: ReactNode, callback?: () => void) {
    this.id = `root-sibling-${uuid + 1}`;
    this.manager = getActiveManager();
    this.manager.update(this.id, element, callback);
    uuid++;
  }

  public update(element: ReactNode, callback?: () => void) {
    this.manager.update(this.id, element, callback);
  }

  public destroy(callback?: () => void) {
    this.manager.destroy(this.id, callback);
  }
}

export function RootSiblingParent(props: {
  children: ReactNode;
  inactive?: boolean;
}) {
  const { inactive } = props;
  const [sibling] = useState<{
    Root: FunctionComponent;
    manager: RootSiblingManager;
  }>(() => {
    const { Root: parentRoot, manager: parentManager } = wrapRootComponent(
      ChildrenWrapper,
      renderSibling
    );

    managerStack.push(parentManager);
    if (inactive) {
      inactiveManagers.add(parentManager);
    }

    return {
      Root: parentRoot,
      manager: parentManager
    };
  });

  useEffect(() => {
    return () => {
      if (sibling) {
        const index = managerStack.indexOf(sibling.manager);
        if (index > 0) {
          managerStack.splice(index, 1);
        }
      }
    };
  }, [sibling]);

  if (inactive && sibling && !inactiveManagers.has(sibling.manager)) {
    inactiveManagers.add(sibling.manager);
  } else if (!inactive && sibling && inactiveManagers.has(sibling.manager)) {
    inactiveManagers.delete(sibling.manager);
  }

  const Parent = sibling.Root;
  return <Parent>{props.children}</Parent>;
}

export function RootSiblingPortal(props: { children: ReactNode }) {
  const [sibling] = useState<RootSiblingsManager>(
    () => new RootSiblingsManager(null)
  );

  sibling.update(props.children);

  useEffect(() => {
    if (sibling) {
      return () => sibling.destroy();
    }
  }, [sibling]);

  return null;
}

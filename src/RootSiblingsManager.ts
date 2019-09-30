import { ReactNode } from 'react';
import { AppRegistry } from 'react-native';

import ChildrenWrapper from './ChildrenWrapper';
import './types/globals';
import './types/react-native';
import wrapRootComponent from './wrapRootComponent';

const { Root, manager } = wrapRootComponent(ChildrenWrapper);

if (!global.__rootSiblingsInjected && !global.__rootSiblingsDisabled) {
  AppRegistry.setWrapperComponentProvider(() => {
    return Root;
  });
  global.__rootSiblingsInjected = true;
}

const uuid: number = 0;
export default class RootSiblingsManager {
  private id: string;

  constructor(element: ReactNode, callback?: () => void) {
    this.id = `root-sibling-${uuid + 1}`;
    manager.update(this.id, element, callback);
  }

  public update(element: ReactNode, callback?: () => void) {
    manager.update(this.id, element, callback);
  }

  public destroy(callback?: () => void) {
    manager.destroy(this.id, callback);
  }
}

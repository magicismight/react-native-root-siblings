import React, {
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
  ReactNode
} from 'react';

import RootController from './RootController';
import RootSiblings from './RootSiblings';

export interface RootSiblingManager {
  update(id: string, element: ReactNode, callback?: () => void): void;
  destroy(id: string, callback?: () => void): void;
}

export default function wrapRootComponent<T = {}>(
  Root: ComponentType<T>,
  renderSibling?: (sibling: ReactNode) => ReactNode
): {
  Root: FunctionComponent<T>;
  manager: RootSiblingManager;
} {
  const controller = new RootController();

  return {
    Root: (props: PropsWithChildren<T>) => {
      return (
        <RootSiblings controller={controller} renderSibling={renderSibling}>
          <Root {...props} />
        </RootSiblings>
      );
    },
    manager: {
      update(id: string, element: ReactNode, callback?: () => void) {
        controller.update(id, element, callback);
      },
      destroy(id: string, callback?: () => void) {
        controller.destroy(id, callback);
      }
    }
  };
}

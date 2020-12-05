import React, { Component, ReactChild, ReactNode } from 'react';
import StaticContainer from './StaticContainer';

import RootController, {
  RootControllerAction,
  RootControllerChanges
} from './RootController';

interface RootSiblingsProps {
  controller: RootController;
  renderSibling?: (sibling: ReactNode) => ReactNode;
  children: ReactChild;
}

interface RootSiblingsState {
  siblings: Array<{
    id: string;
    element: ReactNode;
  }>;
}

export default class extends Component<RootSiblingsProps, RootSiblingsState> {
  private updatedSiblings: Set<string> = new Set();
  private siblingsPool: Array<{
    id: string;
    element: ReactNode;
  }> = [];

  constructor(props: RootSiblingsProps) {
    super(props);

    this.state = {
      siblings: []
    };
  }

  public componentDidMount() {
    this.props.controller.setCallback((id, change) => {
      setImmediate(() => this.commitChange(id, change));
    });
  }

  public componentDidUpdate() {
    this.updatedSiblings.clear();
  }

  public render() {
    return (
      <>
        {this.props.children}
        {this.renderSiblings()}
      </>
    );
  }

  private commitChange(
    id: string,
    { change, element, updateCallback }: RootControllerAction
  ) {
    const siblings = Array.from(this.siblingsPool);
    const index = siblings.findIndex(sibling => sibling.id === id);
    if (change === RootControllerChanges.Remove) {
      if (index > -1) {
        siblings.splice(index, 1);
      } else {
        this.invokeCallback(updateCallback);
        return;
      }
    } else if (change === RootControllerChanges.Update) {
      if (index > -1) {
        siblings.splice(index, 1, {
          element,
          id
        });
        this.updatedSiblings.add(id);
      } else {
        this.invokeCallback(updateCallback);
        return;
      }
    } else {
      if (index > -1) {
        siblings.splice(index, 1);
      }

      siblings.push({
        element,
        id
      });
      this.updatedSiblings.add(id);
    }

    this.siblingsPool = siblings;
    this.setState(
      {
        siblings
      },
      () => this.invokeCallback(updateCallback)
    );
  }

  private invokeCallback(callback?: () => void) {
    if (callback) {
      callback();
    }
  }

  private renderSiblings() {
    return this.state.siblings.map(({ id, element }) => {
      return (
        <StaticContainer
          key={`root-sibling-${id}`}
          shouldUpdate={this.updatedSiblings.has(id)}
        >
          {this.wrapSibling(element)}
        </StaticContainer>
      );
    });
  }

  private wrapSibling(element: ReactNode | null): ReactNode {
    const { renderSibling } = this.props;
    if (renderSibling) {
      return renderSibling(element);
    } else {
      return element;
    }
  }
}

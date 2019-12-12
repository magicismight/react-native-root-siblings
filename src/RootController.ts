import { ReactNode } from 'react';

export enum RootControllerChanges {
  Insert,
  Update,
  Remove
}

export interface RootControllerAction {
  change: RootControllerChanges;
  element: ReactNode;
  updateCallback?: () => void;
}

export default class RootController {
  private siblings: Set<string> = new Set();
  private pendingActions: Array<{
    id: string;
    action: RootControllerAction;
  }> = [];
  private callback:
    | ((id: string, action: RootControllerAction) => void)
    | null = null;

  public update(id: string, element: ReactNode, callback?: () => void) {
    if (!this.siblings.has(id)) {
      this.emit(id, {
        change: RootControllerChanges.Insert,
        element,
        updateCallback: callback
      });
      this.siblings.add(id);
    } else {
      this.emit(id, {
        change: RootControllerChanges.Update,
        element,
        updateCallback: callback
      });
    }
  }

  public destroy(id: string, callback?: () => void) {
    if (this.siblings.has(id)) {
      this.emit(id, {
        change: RootControllerChanges.Remove,
        element: null,
        updateCallback: callback
      });
      this.siblings.delete(id);
    } else if (callback) {
      callback();
    }
  }

  public setCallback(
    callback: (id: string, action: RootControllerAction) => void
  ) {
    this.callback = callback;
    this.pendingActions.forEach(({ id, action }) => {
      callback(id, action);
    });
  }

  private emit(id: string, action: RootControllerAction) {
    if (this.callback) {
      this.callback(id, action);
    } else {
      this.pendingActions.push({
        action,
        id
      });
    }
  }
}

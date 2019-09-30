import { ComponentType } from 'react';
import * as ReactNative from 'react-native';

declare module 'react-native' {
  export namespace AppRegistry {
    export function setWrapperComponentProvider(
      provider: () => ComponentType
    ): void;
  }
}

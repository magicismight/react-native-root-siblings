import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry } from 'react-native';
import StaticContainer from 'static-container';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

function RootSiblingsWrapper(props) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {props.children}
      <RootSiblings />
    </View>
  );
};

if (!global.__rootSiblingsInjected) {
  AppRegistry.setWrapperComponentProvider(function() {
    return RootSiblingsWrapper;
  });
  global.__rootSiblingsInjected = true;
}

let Provider = null;
let uuid = 0;
const triggers = [];
const pendingSiblings = {};
class RootSiblings extends Component {
  _updatedSiblings = {};
  _siblings = {};
  _stores = {};

  componentDidMount() {
    triggers.push(this._update);
    Object.keys(pendingSiblings).forEach((id) => {
      const sibling = pendingSiblings[id];
      if (sibling) {
        this._update(id, ...sibling);
        delete pendingSiblings[id];
      }
    });
  }

  componentWillUnmount() {
    triggers.splice(triggers.indexOf(this._update), 1);
  }

  _update = (id, element, callback, store) => {
    const siblings = { ...this._siblings };
    const stores = { ...this._stores };
    if (siblings[id] && !element) {
      delete siblings[id];
      delete stores[id];
    } else if (element) {
      siblings[id] = element;
      stores[id] = store;
    }
    this._updatedSiblings[id] = true;
    this._siblings = siblings;
    this._stores = stores;
    this.forceUpdate(callback);
  };

  render() {
    const siblings = this._siblings;
    const stores = this._stores;
    const elements = [];
    Object.keys(siblings).forEach(key => {
      const element = siblings[key];
      if (element) {
        const sibling = (
          <StaticContainer
            key={`root-sibling-${key}`}
            shouldUpdate={!!this._updatedSiblings[key]}
          >
            {element}
          </StaticContainer>
        );

        const store = stores[key];
        if (store && Provider) {
          elements.push(
            <Provider store={store} key={`root-sibling-${key}-provider`}>
              {sibling}
            </Provider>
          );
        } else {
          elements.push(sibling);
        }
      }
    });
    this._updatedSiblings = {};
    return elements;
  }
}

export function enableStoreProvider(StoreProvider) {
  Provider = StoreProvider;
}

export default class RootSiblingManager {
  constructor(element, callback, store) {
    const id = uuid++;
    function update(element, callback, store) {
      if (triggers.length) {
        triggers.forEach(function(trigger) {
          trigger(id, element, callback, store);
        });
      } else {
        pendingSiblings[id] = [element, callback, store];
      }
    }

    function destroy(callback) {
      if (pendingSiblings[id]) {
        delete pendingSiblings[id];
      } else {
        triggers.forEach(function(trigger) {
          trigger(id, null, callback);
        });
      }
    }

    update(element, callback, store);
    this.update = update;
    this.destroy = destroy;
  }
}


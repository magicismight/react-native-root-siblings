import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry } from 'react-native';
import StaticContainer from 'static-container';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class Provider extends Component {
  static childContextTypes = {
    store: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired,
    }),
  };

  getChildContext() {
    return { store: this.props.store };
  }

  render() {
    return this.props.children;
  }
}

AppRegistry.setWrapperComponentProvider(function() {
  return function RootSiblingsWrapper(props) {
    return (
      <View style={styles.container}>
        {props.children}
        <RootSiblings />
      </View>
    );
  };
});

let uuid = 0;
const triggers = [];
class RootSiblings extends Component {
  _updatedSiblings = {};
  _siblings = {};
  _stores = {};

  constructor(props) {
    super(props);
    this._siblings = {};
    triggers.push(this._update);
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
          <StaticContainer key={`root-sibling-${key}`} shouldUpdate={!!this._updatedSiblings[key]}>
            {element}
          </StaticContainer>
        );

        const store = stores[key];
        if (store) {
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

export default class RootSiblingManager {
  constructor(element, callback, store) {
    const id = uuid++;
    function update(element, callback, store) {
      triggers.forEach(function(trigger) {
        trigger(id, element, callback, store);
      });
    }

    function destroy(callback) {
      triggers.forEach(function(trigger) {
        trigger(id, null, callback);
      });
    }

    update(element, callback, store);
    this.update = update;
    this.destroy = destroy;
  }
}

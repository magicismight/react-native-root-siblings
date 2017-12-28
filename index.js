import React, { Component, cloneElement } from 'react';
import { StyleSheet, View, AppRegistry } from 'react-native';
import StaticContainer from 'static-container';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

let uuid = 0;
const triggers = [];

AppRegistry.setWrapperComponentProvider(function () {
  return class extends Component {
    static displayName = 'RootSiblingsWrapper';

    constructor(props) {
      super(props);
      this._siblings = {};
    }

    componentWillMount() {
      triggers.push(this._update);
    }

    componentWillUnmount() {
      triggers.splice(triggers.indexOf(this._update), 1);
    }

    _updatedSiblings = {};
    _siblings = {};

    _update = (id, element, callback) => {
      const siblings = { ...this._siblings };
      if (siblings[id] && !element) {
        delete siblings[id];
      } else if (element) {
        siblings[id] = element;
      }

      this._updatedSiblings[id] = true;
      this._siblings = siblings;
      this.forceUpdate(callback);
    };

    render() {
      const siblings = this._siblings;
      const elements = [];
      Object.keys(siblings).forEach((key) => {
        const element = siblings[key];
        element && elements.push(
          <StaticContainer
            key={`root-sibling-${key}`}
            shouldUpdate={!!this._updatedSiblings[key]}
          >
            {element}
          </StaticContainer>
        );
      });
      this._updatedSiblings = {};
      return (
        <View style={styles.container}>
          <StaticContainer shouldUpdate={false}>
            {this.props.children}
          </StaticContainer>
          {elements}
        </View>
      );
    }
  }
})

export default class {
  constructor(element, callback) {
    const id = uuid++;
    function update(element, callback) {
      triggers.forEach(function (trigger) {
        trigger(id, element, callback);
      });
    };

    function destroy (callback) {
      triggers.forEach(function (trigger) {
        trigger(id, null, callback);
      });
    };

    update(element, callback);
    this.update = update;
    this.destroy = destroy;
  }
}

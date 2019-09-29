import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry } from 'react-native';
import StaticContainer from 'static-container';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


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
const pendingSiblings = {};
class RootSiblings extends Component {
  _updatedSiblings = {};
  _siblings = {};

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
    Object.keys(siblings).forEach(key => {
      const element = siblings[key];
      if (element) {
        const sibling = (
          <StaticContainer key={`root-sibling-${key}`} shouldUpdate={!!this._updatedSiblings[key]}>
            {element}
          </StaticContainer>
        );

        elements.push(sibling);
      }
    });
    this._updatedSiblings = {};
    return elements;
  }
}

export default class RootSiblingManager {
  constructor(element, callback) {
    const id = uuid++;
    function update(element, callback) {
      if (triggers.length) {
        triggers.forEach(function(trigger) {
          trigger(id, element, callback);
        });
      } else {
        pendingSiblings[id] = [element, callback];
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

    update(element, callback);
    this.update = update;
    this.destroy = destroy;
  }
}

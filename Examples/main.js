'use strict';
import React, { Component } from 'react';
import { View, AppRegistry, TouchableHighlight, StyleSheet, Text, Dimensions } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

let id = 0;
const elements = [];
class SiblingsExample extends Component{
    addSibling = () => {
        const sibling = new RootSiblings(
            <View
                style={[styles.sibling, {top: elements.length * 20}]}
            >
                <Text>I`m No.{id}</Text>
            </View>
        );
        sibling.id = id;
        id++;
        elements.push(sibling);
    };

    destroySibling = () => {
        const lastSibling = elements.pop();
        lastSibling && lastSibling.destroy();
    };

    updateSibling = () => {
        const last = elements[elements.length - 1];
        last && last.update(
            <View
                style={[styles.sibling, {top: (elements.length - 1) * 20}]}
            >
                <Text>I`m No.{last.id} : {Math.random()}</Text>
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.addSibling}
                >
                    <Text style={styles.buttonText}>Add element</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.destroySibling}
                >
                    <Text style={styles.buttonText}>Destroy element</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.updateSibling}
                >
                    <Text style={styles.buttonText}>Update last element</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

AppRegistry.registerComponent('SiblingsExample', () => SiblingsExample);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
    },
    button: {
        borderRadius: 4,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ccc',
        borderColor: '#333',
        borderWidth: 1,
    },
    buttonText: {
        color: '#000'
    },
    sibling: {
        left: 0,
        height: 20,
        width: Dimensions.get('window').width / 2,
        backgroundColor: 'blue',
        opacity: 0.9
    }
});

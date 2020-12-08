## react-native-root-siblings [![npm version](https://badge.fury.io/js/react-native-root-siblings.svg)](http://badge.fury.io/js/react-native-root-siblings)
---

Version 4.x requires react-native version >= 0.59, 3.x requires react-native version >= 0.47

Add sibling elements after your app root element.
The created sibling elements are above the rest of your app elements.
This can be used to create a `Modal` component or something should be over your app.

# BREAKING CHANGE

## For react native >= 0.62

The [new LogBox component](https://github.com/facebook/react-native/blob/0b9ea60b4fee8cacc36e7160e31b91fc114dbc0d/Libraries/ReactNative/AppRegistry.js#L298-L309) would impact this component's initialization. To make it work we have to explicitly insert a mount point in your app like this:

```
// in your entry file like `App.js`
import { RootSiblingParent } from 'react-native-root-siblings';

// in your render function 
return (
  <RootSiblingParent>  // <- use RootSiblingParent to wrap your root component
    <App />
  </RootSiblingParent>
);
            
```

You can skip this step if your react-native is lower than 0.62. And actually you can inject RootSiblingParent into anywhere like a react portal, for example if you have multiple rootviews you can choose which one to hold the root siblings.

## 4.x
From 4.0 the redux store context injection is not enabled by default, the redux store context should be set by a context wrapper.

```
import { setSiblingWrapper } from 'react-native-root-siblings';
import { Provider } from 'react-redux';

// const store = ... get store;

// Call this before using redux context inside RootSiblings.
setSiblingWrapper((sibling) => <Provider store={store}>{sibling}</Provider>);
```

You can also use `setSiblingWrapper` to provide other context into each sibling node.


## 3.x
From 3.0 the default style has been removed from the element.
https://github.com/magicismight/react-native-root-siblings/commit/75b1f65502f41a5ecad0d17fd8d6ebb400365928

### Add it to your project

Run `npm install react-native-root-siblings --save`

### USAGE
This library can add element above the root app component registered by `AppRegistry.registerComponent`.

#### Class API

1. Create sibling element

```js
let sibling = new RootSiblings(<View
    style={{top: 0,right: 0,bottom: 0,left: 0,backgroundColor: 'red'}}
/>);
```

This will create a View element cover all of your app elements,
and returns a sibling instance.
You can create a sibling anywhere inside your react native code.

2. Update sibling element

```js
sibling.update(<View
    style={{top: 10,right: 10,bottom: 10,left: 10,backgroundColor: 'blue'}}
/>);
```

This will update the sibling instance to a View with blue backgroundColor and cover the screen by `10` offset distance.

3. Destroy sibling element

```js
sibling.destroy();
```

This will remove the sibling element.


#### Component API

```
import { RootSiblingPortal } from 'react-native-root-siblings';


class extends Component {
    render() {
        return (
            <RootSiblingPortal>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.25)' }]} />
            </RootSiblingPortal>
        )
    }
}

```

### EXAMPLE

```js
import React, {
    AppRegistry,
    View,
    Component,
    TouchableHighlight,
    StyleSheet,
    Text
} from 'react-native';
import Dimensions from 'Dimensions';

// Import library there,it will wrap everything registered by AppRegistry.registerComponent
// And add or remove other elements after the root component
import RootSiblings from 'react-native-root-siblings';

var id = 0;
var elements = [];
class SiblingsExample extends Component{
    addSibling = () => {
        let sibling = new RootSiblings(<View
            style={[styles.sibling, {top: id * 20}]}
        >
            <Text>I`m No.{id}</Text>
        </View>);
        id++;
        elements.push(sibling);
    };

    destroySibling = () => {
        let lastSibling = elements.pop();
        lastSibling && lastSibling.destroy();
    };

    updateSibling = () => {
        let lastId = elements.length - 1;
        lastId >= 0 && elements[lastId].update(<View
            style={[styles.sibling, {top: lastId * 20}]}
        >
            <Text>I`m No.{lastId} : {Math.random()}</Text>
        </View>);
    };

    render() {
        return <View style={styles.container}>
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
                <Text style={styles.buttonText}>Update element</Text>
            </TouchableHighlight>
        </View>;
    }
}

AppRegistry.registerComponent('SiblingsExample', () => SiblingsExample);

var styles = StyleSheet.create({
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
        opacity: 0.5
    }
});

```

![screen shoot](./Examples/screen-shoot.gif)

### RUN EXAMPLE

1. fork this repository
2. change dictionary to `Examples`
3. run `npm i`

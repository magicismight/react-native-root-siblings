## react-native-root-siblings [![npm version](https://badge.fury.io/js/react-native-root-siblings.svg)](http://badge.fury.io/js/react-native-root-siblings)

The easiest way to create overlays(`Modal`, `Popover`, `Dialog` etc) for both `react` and `react-native`. 

Make your own `showModal` and use it in any component without any `isShow` state or even in a pure function call.

```jsx
import { ReactNode } from 'react';
import RootSiblingsManager from 'react-native-root-siblings';

export const showModal = (renderModal) => {
  let rootNode;
  const onClose = () => {
    rootNode?.destroy();
    rootNode = null;
  };
  rootNode = new RootSiblingsManager(renderModal(onClose));
  return onClose;
};

import WelcomeModal from './WelcomeModal';

export function showWelcomeModal() {
  showModal((onClose) => <WelcomeModal onClose={onClose} />);
}

// ...
function HomeScreen() {
  return <Button onClick={showWelcomeModal}>Welcome!</Button>
}

setTimeout(showWelcomeModal, 3000);
```

---


## Installation

```sh
npm i react-native-root-siblings
```

Insert `RootSiblingParent` between your providers and root app in your root render function.

```jsx
import { RootSiblingParent } from 'react-native-root-siblings';

return (
  <SomeProviders>
    <RootSiblingParent>  // <- use RootSiblingParent to wrap your root component
      <App />
    </RootSiblingParent>
  </SomeProviders>
);      
```

`RootSiblingParent` works as a mounting base and can be mounted multiple times. Only the last mounted one would be active.

In react native, a view has a higher hierarchy if it's more close to the root level.

```jsx
<RootSiblingParent>
  <RootView>  //  <- the highest view
    <NavigationView>
      <ScreenView>  //  <- the lowest view
       { /* what if you want to show a fullscreen modal here?
          * usually you have to use a Native Modal which is even higher than RootView
          * but it's buggy and has a lot of limitations
          */}
        <RootSiblingPortal>
        { /* View put in here would be transported to RootSiblingParent 
            * So it can have a same hierarchy as the RootView to cover any other views
            */}
          <View>
          </View>
        </RootSiblingPortal>
      </ScreenView>
    </NavigationView>
  </View>
</RootSiblingParent>
```

In react we have `createPortal` but still it's not so convenient as it can not be used outside of a component. 

`react-native-root-siblings` provides the most possible flexibility:



## Usage

### Imperative API

1. Create sibling element

```jsx
let sibling = new RootSiblings(<View
    style={{top: 0,right: 0,bottom: 0,left: 0,backgroundColor: 'red'}}
/>);
```

This will create a View element cover all of your app elements,
and returns a sibling instance.
You can create a sibling anywhere, no matter in a component, hook or even a pure function.

2. Update sibling element

```jsx
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


### Component API

```jsx
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

## EXAMPLE

```jsx
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

## RUN EXAMPLE

1. fork this repository
2. change dictionary to `Examples`
3. run `npm i`

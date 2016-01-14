### react-native-root-siblings
---

Add sibling elements to your app root


### Add it to your project

1. Run `npm install react-native-root-siblings --save`
2. Import library **before** `AppRegistry.registerComponent`

```javascript
...do something there
**import 'react-native-root-siblings';**
...do something else

*AppRegistry.registerComponent('MyApp', () => MyApp);*

```

### USAGE

```
'use strict';
import React, {
    AppRegistry,
    View,
    View,
    Component,
    TouchableHighlight,
    Text
} from 'react-native';
import Dimensions from 'Dimensions';

// Import library there,it will wrap everything registered by AppRegistry.registerComponent
// And add or remove other elements after the root component
**import RootSiblings from 'react-native-root-siblings';**

var id = 0;
var elements = [];
class SiblingsExample extends Component{
    addSibling = () {
        let sibling = new RootSiblings(<View
            style={[styles.sibling, {top: id * 20}]}
        >
            <Text>I`m No.{id}</Text>
        </View>);
        id++;
        elements.push(sibling);
    };

    destroySibling = () {
        let lastSibling = elements.pop();
        lastSibling.destroy();
    };

    updateSibling = () {

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
        backgroundColor: 'blue'
    }
});

```


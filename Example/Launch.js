import React, {
    Component,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import {Actions} from 'react-native-redux-router';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
});

class Launch extends Component{
    render() {
        return <View style={styles.container}>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#aaa"
                onPress={Actions.simple}
            >
                <Text>Simple Modal</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#aaa"
                onPress={Actions.customStyle}
            >
                <Text>Custom Modal</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#aaa"
                onPress={Actions.animation}
            >
                <Text>Animations</Text>
            </TouchableHighlight>
        </View>
    }
}

export default Launch;

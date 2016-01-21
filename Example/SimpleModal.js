import React, {
    Component,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';

import Modal from 'react-native-root-modal';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        padding: 10
    },
    close: {
        position: 'absolute',
        right: 20,
        top: 40,
        backgroundColor: 'red'
    },
    modalContainer: {
        height: 100,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue'
    },
    text: {
        color: '#fff'
    }
});

class SimpleModal extends Component{
    constructor() {
        super(...arguments);
        this.state = {
            visible: false
        };
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    hideModal = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        return <View style={styles.container}>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#aaa"
                onPress={this.showModal}
            >
                <Text>Show Modal</Text>
            </TouchableHighlight>
            <Modal
                visible={this.state.visible}
            >
                <TouchableHighlight
                    style={[styles.button, styles.close]}
                    underlayColor="#aaa"
                    onPress={this.hideModal}
                >
                    <Text>Close</Text>
                </TouchableHighlight>

                <View style={styles.modalContainer}>
                    <Text style={styles.text}>Amazing!</Text>
                </View>
            </Modal>
        </View>;
    }
}

export default SimpleModal;

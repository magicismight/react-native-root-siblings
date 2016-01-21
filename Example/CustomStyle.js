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
    modal: {
        top: 40,
        right: 40,
        bottom: 20,
        left: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(58, 93, 15, 0.8)',
        borderRadius: 40,
        overflow: 'hidden'
    },
    close: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
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

class CustomStyle extends Component{
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
                style={styles.modal}
                visible={this.state.visible}
            >
                <TouchableHighlight
                    style={[styles.button, styles.close]}
                    underlayColor="#aaa"
                    onPress={this.hideModal}
                >
                    <Text>X</Text>
                </TouchableHighlight>

                <View style={styles.modalContainer}>
                    <Text style={styles.text}>You can custom your own Modal style</Text>
                </View>
            </Modal>
        </View>;
    }
}

export default CustomStyle;

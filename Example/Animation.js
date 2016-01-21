import React, {
    Component,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Animated
} from 'react-native';

import Modal from 'react-native-root-modal';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    modal: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 0, 0, 0.2)'
    },
    button: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
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
class Animation extends Component{
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
            scale: new Animated.Value(1),
            x: new Animated.Value(0)
        };
    }

    slideModal = () => {
        this.state.x.setValue(-320);
        this.state.scale.setValue(1);
        Animated.spring(this.state.x, {
            toValue: 0
        }).start();
        this.setState({
            visible: true
        });
        this.slide = true;
    };

    scaleModal = () => {
        this.state.x.setValue(0);
        this.state.scale.setValue(0);
        Animated.spring(this.state.scale, {
            toValue: 1
        }).start();
        this.setState({
            visible: true
        });
        this.slide = false;
    };

    hideModal = () => {
        if (this.slide) {
            Animated.timing(this.state.x, {
                toValue: -320
            }).start(() => {
                this.setState({
                    visible: false
                });
            });
        } else {
            Animated.timing(this.state.scale, {
                toValue: 0
            }).start(() => {
                this.setState({
                    visible: false
                });
            });
        }

    };

    render() {
        return <View style={styles.container}>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#aaa"
                onPress={this.slideModal}
            >
                <Text>Slide</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#aaa"
                onPress={this.scaleModal}
            >
                <Text>Scale</Text>
            </TouchableHighlight>
            <Animated.Modal
                visible={this.state.visible}
                style={[styles.modal, {
                    transform: [
                        {
                            scale: this.state.scale
                        },
                        {
                            translateX: this.state.x
                        }
                    ]
                }]}
            >
                <TouchableHighlight
                    style={[styles.button, styles.close]}
                    underlayColor="#aaa"
                    onPress={this.hideModal}
                >
                    <Text>Close</Text>
                </TouchableHighlight>

                <View style={styles.modalContainer}>
                    <Text style={styles.text}>You can set any animation on Modal element</Text>
                </View>
            </Animated.Modal>
        </View>;
    }
}

export default Animation;

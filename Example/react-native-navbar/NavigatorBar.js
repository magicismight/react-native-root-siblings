import React from 'react-native';
const {
    Component,
    Text,
    View,
    PropTypes
    } = React;
import NavbarButton from './NavbarButton';
import styles from './styles';

const ButtonShape = {
    title: PropTypes.string.isRequired,
    style: PropTypes.any,
    handler: PropTypes.func
};

const TitleShape = {
    title: PropTypes.string.isRequired,
    tintColor: PropTypes.string
};


class NavigationBar extends Component {

    getButtonElement(data = {}, style) {
        if (!!data.props) {
            return <View style={styles.navBarButton}>{data}</View>;
        }

        return <NavbarButton
            title={data.title}
            style={[data.style, style, ]}
            tintColor={data.tintColor}
            handler={data.handler} />;
    }

    getTitleElement(data) {
        if (!!data.props) {
            return <View style={styles.customTitle}>{data}</View>;
        }

        const colorStyle = data.tintColor ? { color: data.tintColor, } : null;

        return (
            <Text
                style={[styles.navBarTitleText, colorStyle, ]}>
                {data.title}
            </Text>
        );
    }

    render() {
        const customTintColor = this.props.tintColor ?
        { backgroundColor: this.props.tintColor } : null;

        return (
            <View style={[styles.navBarContainer, customTintColor, ]}>
                <View style={[styles.navBar, this.props.style, ]}>
                    {this.getTitleElement(this.props.title)}
                    {this.getButtonElement(this.props.leftButton, { marginLeft: 8, })}
                    {this.getButtonElement(this.props.rightButton, { marginRight: 8, })}
                </View>
            </View>
        );
    }

    static propTypes = {
        tintColor: PropTypes.string,
        leftButton: PropTypes.oneOfType([
            PropTypes.shape(ButtonShape),
            PropTypes.element,
        ]),
        rightButton: PropTypes.oneOfType([
            PropTypes.shape(ButtonShape),
            PropTypes.element,
        ]),
        title: PropTypes.oneOfType([
            PropTypes.shape(TitleShape),
            PropTypes.element,
        ]),
    };
}
module.exports = NavigationBar;

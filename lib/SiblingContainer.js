import React, {
    StyleSheet,
    Component,
    View,
    cloneElement
} from 'react-native';

import onlyChild from 'onlyChild';

let styles = StyleSheet.create({
    offStream: {
        position: 'absolute'
    }
});

class SiblingContainer extends Component {
    static displayName = 'SiblingContainer';

    static propTypes = {
        ...View.propTypes
    };

    shouldComponentUpdate = () => false;

    render() {
        return cloneElement(onlyChild(this.props.children), {
            style: [this.props.children.props.style, styles.offStream]
        });
    }
}

export default SiblingContainer;

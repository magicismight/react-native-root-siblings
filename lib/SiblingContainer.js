import React, {
    StyleSheet,
    Component,
    View,
    cloneElement,
    Children,
    PropTypes
} from 'react-native';

let onlyChild = Children.only;
let styles = StyleSheet.create({
    offStream: {
        position: 'absolute'
    }
});

class SiblingContainer extends Component {
    static displayName = 'SiblingContainer';

    static propTypes = {
        shouldUpdate: PropTypes.bool
    };

    static defaultProps = {
        shouldUpdate: false
    };

    shouldComponentUpdate = nextProps => {
        return nextProps.shouldUpdate;
    };

    render() {
        return this.props.root ?
            this.props.children :
            cloneElement(onlyChild(this.props.children), {
                style: [this.props.children.props.style, styles.offStream],
                siblingManager: this.props.manager
            });
    }
}

export default SiblingContainer;

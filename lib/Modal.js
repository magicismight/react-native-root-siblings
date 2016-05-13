import {
    View,
    Animated
} from 'react-native';
import React, {
    Component,
    PropTypes
} from 'react';

import RootSiblings from 'react-native-root-siblings';
import ModalContainer from './ModalContainer';

class Modal extends Component {
    static displayName = 'Modal';
    static propTypes = {
        visible: PropTypes.bool,
        ...View.propTypes
    };
    static defaultProps = {
        visible: false
    };

    componentWillMount = () => {
        this._modal = new RootSiblings(<ModalContainer
            {...this.props}
        />);
    };

    componentWillReceiveProps = nextProps => {
        this._modal.update(<ModalContainer
            {...nextProps}
        />);
    };

    componentWillUnmount = () => {
        this._modal.destroy();
    };

    render() {
        return null;
    }
}

let AnimatedModal = Animated.createAnimatedComponent(Modal);

if (!Animated.Modal) {
    Animated.Modal = AnimatedModal;
}

export {
    RootSiblings as Manager,
    AnimatedModal as Animated
}
export default Modal;

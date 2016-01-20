import React, {
    Component,
    View,
    PropTypes
} from 'react-native';
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

export let Manager = RootSiblings;

export default Modal;

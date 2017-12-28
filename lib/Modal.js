import { View, Animated } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RootSiblings from 'react-native-root-siblings';
import { Provider } from 'react-redux';

import ModalContainer, { AnimatedModalContainer } from './ModalContainer';

const subscriptionShape = PropTypes.shape({
    trySubscribe: PropTypes.func.isRequired,
    tryUnsubscribe: PropTypes.func.isRequired,
    notifyNestedSubs: PropTypes.func.isRequired,
    isSubscribed: PropTypes.func.isRequired,
});

const storeShape = PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
});

const storeKey = 'store';
const subscriptionKey = storeKey + 'Subscription';

const contextTypes = {
    [storeKey]: storeShape,
    [subscriptionKey]: subscriptionShape
};

const childContextTypes = {
    [subscriptionKey]: subscriptionShape
};

class Modal extends Component {
    static displayName = 'Modal';
    static childContextTypes = contextTypes;
    static contextTypes = childContextTypes;
    static propTypes = {
        visible: PropTypes.bool,
        ...Animated.View.propTypes,
        ...childContextTypes
    };
    static defaultProps = {
        visible: false
    };

    componentWillMount() {
        this._modal = new RootSiblings(this._getContent(ModalContainer, this.props));
    };

    componentWillReceiveProps(nextProps) {
        this._modal.update(this._getContent(ModalContainer, nextProps));
    };

    componentWillUnmount() {
        this._modal.destroy();
    };

    getChildContext() {
        // If this component received store from props, its subscription should be transparent
        // to any descendants receiving store+subscription from context; it passes along
        // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
        // Connect to control ordering of notifications to flow top-down.
        const subscription = this.propsMode ? null : this.subscription
        return { [subscriptionKey]: subscription || this.context[subscriptionKey] }
    }

    _getContent(Container, props) {
        const parentSub = this.props[subscriptionKey] || this.context[subscriptionKey];
        if (parentSub) {
            return (
              <Provider store={parentSub[storeKey]}>
                  <Container
                    {...props}
                  />
              </Provider>
            );
        } else {
            return (
              <Container
                {...props}
              />
            );
        }
    }

    render() {
        return null;
    }
}

class AnimatedModal extends Modal {
    componentWillMount() {
        this._modal = new RootSiblings(this._getContent(AnimatedModalContainer, this.props));
    };

    componentWillReceiveProps(nextProps)  {
        this._modal.update(this._getContent(AnimatedModalContainer, nextProps));
    };
}

if (!Animated.Modal) {
    Animated.Modal = AnimatedModal;
}

export {
    RootSiblings as Manager,
    AnimatedModal as Animated
}
export default Modal;

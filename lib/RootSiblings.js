import {
    StyleSheet,
    View,
    AppRegistry
} from 'react-native';
import React, {
    Component
} from 'react';

import _ from 'lodash';
import SiblingsManager from './SiblingsManager';
import SiblingContainer from './SiblingContainer';

let styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    }
});

// inject modals into app entry component
let originRegister = AppRegistry.registerComponent;
AppRegistry.registerComponent = function (appKey, getComponentFunc) {
    return originRegister(appKey, () => {
        let Origin = getComponentFunc();
        return React.createClass({
            displayName: `Root(${appKey})`,
            getInitialState() {
                return {
                    siblings: {},
                    update: null
                };
            },

            componentWillMount() {
                SiblingsManager.addListener('set', this.onSet);
                SiblingsManager.addListener('update', this.onUpdate);
                SiblingsManager.addListener('destroy', this.onDestroy);
            },

            onSet(element, manager, id) {
                this.state.siblings[id] = {
                    element,
                    manager
                };
                this.forceUpdate();
            },

            onUpdate(element, prevElement, id) {
                this.state.siblings[id].element = element;
                this.setState({
                    update: id
                });
            },

            onDestroy(destroyed, id) {
                delete this.state.siblings[id];
                this.forceUpdate();
            },

            getSiblings() {
                let siblings =  _.map(this.state.siblings, (sibling, id) => <SiblingContainer
                    key={`sibling-${id}`}
                    shouldUpdate={this.state.update == id}
                    manager={sibling.manager}
                >
                    {sibling.element}
                </SiblingContainer>);
                this.state.update = null;
                return siblings;
            },

            render() {
                return <View style={styles.container}>
                    <SiblingContainer
                        root={true}
                        shouldUpdate={false}
                    >
                        <Origin {...this.props} />
                    </SiblingContainer>
                    {this.getSiblings()}
                </View>;
            }
        });
    });
};

export default SiblingsManager;

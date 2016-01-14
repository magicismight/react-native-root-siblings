import React, {
    StyleSheet,
    Component,
    View,
    AppRegistry,
    StaticContainer
} from 'react-native';

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
                    siblings: {}
                };
            },

            componentWillMount() {
                SiblingsManager.addListener('set', this.onSet);
                SiblingsManager.addListener('update', (props, prevProps, id) =>
                    this.onSet(props, id)
                );
                SiblingsManager.addListener('destroy', this.onDestroy);
            },

            onSet(element, id) {
                this.state.siblings[id] = element;
                this.forceUpdate();
            },

            onDestroy(destroyed, id) {
                delete this.state.siblings[id];
                this.forceUpdate();
            },

            getSiblings() {
                return _.map(this.state.siblings, (sibling, id) => <SiblingContainer
                    key={`sibling-${id}`}
                >
                    {sibling}
                </SiblingContainer>);
            },

            render() {
                return <View style={styles.container}>
                    <StaticContainer shouldUpdate={false}>
                        <Origin {...this.props} />
                    </StaticContainer>
                    {this.getSiblings()}
                </View>;
            }
        });
    });
};

export default SiblingsManager;

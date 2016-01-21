/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    Router,
    routerReducer,
    Route,
    Container,
    Animations,
    Schema
} from 'react-native-redux-router';

import NavBar from './react-native-navbar/NavBar';
import SimpleModal from './SimpleModal';
import CustomStyle from './CustomStyle';
import Animation from './Animation';
import Launch from './Launch';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux/native';

let store = createStore(combineReducers({routerReducer}));

class App extends Component {
    render() {
        return (
            <View style={{flex:1}}>
                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#F5FCFF'}}/>
                <Router>
                    <Schema name="default" sceneConfig={Animations.FlatFloatFromRight} navBar={NavBar}/>

                    <Route name="launch" component={Launch} initial={true} hideNavBar={true} title="RootModal"/>
                    <Route name="simple" component={SimpleModal} title="SimpleModal"/>
                    <Route name="customStyle" component={CustomStyle} title="CustomStyle"/>
                    <Route name="animation" component={Animation} title="Animations"/>
                </Router>

            </View>
        );
    }
}

class Example extends React.Component {
    render() {
        return (
            <Provider store={store}>
                {() => <App />}
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

AppRegistry.registerComponent('RootModalExample', () => Example);

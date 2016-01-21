'use strict';

var NavigationBar = require('./NavigatorBar');
var React = require('react-native');
var {StyleSheet,View} = React;

class NavBarBase extends React.Component {
    onPrev(){
        var Actions = this.props.routes;
        if (this.props.onPrev){
            this.props.onPrev();
            return;
        }
        if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1){
            Actions.pop();
        }
    }
    render() {
        var Actions = this.props.routes;
        return <NavigationBar style={styles.navBar}
                              titleColor='white'
                              buttonsColor='white'
                              title= {{title:this.props.title}}
                              prevTitle={this.props.initial ? " " : null}
                              leftButton = {this.props.leftButton ? this.props.leftButton : {title:''}}
                              rightButton = {this.props.rightButton ? this.props.rightButton : {title:''}}



        />
    }
}
class NavBar extends React.Component {
    render() {
        var Actions = this.props.routes;
        return <NavBarBase
            customNext={<View/>}
            {...this.props}
           leftButton={{title:'Back', handler:this.props.onPrev || Actions.pop}}
        />
    }
}

var styles = StyleSheet.create({
    navBar: {
        backgroundColor: '#0db0d9'
    }
});

export default NavBar;

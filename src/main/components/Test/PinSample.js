import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform } from 'react-native';
import Loading from '../../import/Loading';
import {print, customAlert} from '../../import/func';
import {increment} from '../../reducers/baseReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PinScreen } from 'react-native-awesome-pin';

const LIMIT = 5;
class PinSample extends Component {
    constructor(props){
		super(props);
		this.state = {
            pin : '',
		}
	}

	componentDidMount(){
	}

	componentWillUnmount() {
		// this.didFocus.remove();
	}

    recievePin(pin){
        // Clear error on interaction
        this.pinScreen.clearError();

        this.setState({ pin : pin, })

        console.log(pin);

        if(pin.length >= LIMIT){
            if(pin != '12345'){
                this.pinScreen.throwError('Your PIN is incorrect');
            }

            this.setState({ pin : '', });
        }
    }

    render(){
        return (
            <PinScreen
                pin={this.state.pin}
                numberOfPins={LIMIT}
                onRef={ ref => (this.pinScreen = ref) }
                tagline='Please enter your PIN'
                containerStyle={{ backgroundColor: '#AAA' }}
                keyDown={ this.recievePin.bind(this) }
            />
        );
    }
}

function mapStateToProps (state) {
    // mapStateToProps여기에 로그 넣으면 속도 저하 발생
    return {
        state: state,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        increment: increment,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PinSample)

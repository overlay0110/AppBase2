import React, {Component} from 'react';
import { View, Text, Button } from 'react-native';
import { increment, decrement } from '../../reducers/baseReducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNLockScreen from 'react-native-lock-screen';

class PatternLock extends Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
	}

	componentWillUnmount() {
		// this.didFocus.remove();
	}

	render() {
		return (
			<RNLockScreen 
				type={1} 
				mode={RNLockScreen.Mode.Capture} 
				onCapture={lock => {
				}} 
				onVerified={() => {
	 
				}}
				lock={'123'}
			/>
		);
	}
}

// Reducer 데이터를 props로 변환
function mapStateToProps(state){
	return {
		state: state.countReducer
	};
}

// Actions을 props로 변환
function matchDispatchToProps(dispatch){
	return bindActionCreators({
		increment: increment,
		decrement: decrement
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PatternLock);

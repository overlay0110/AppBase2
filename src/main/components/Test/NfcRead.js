import React, {Component} from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { increment, decrement } from '../../reducers/baseReducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {print, customAlert, qrBaseUrl, creTranCode, getTimestamp} from '../../import/func';
import NfcManager, {NfcEvents, Ndef, NfcTech} from 'react-native-nfc-manager';
import {callApi2, callApiFile} from '../../import/funcHTTP';

class NfcRead extends Component {
	constructor(props){
		super(props);
		this.state = {
			tag_id : '',
			datas : [],
			view_datas : '',
		}
	}

	componentDidMount(){
		NfcManager.start();
	}

	componentWillUnmount() {
		// this.didFocus.remove();
		NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
		NfcManager.unregisterTagEvent().catch(() => 0);
	}

	async readNdef(){
		print('readNdef()');
		let result = false;

		try{
			if (Platform.OS === 'ios') {
				// NOTICE: iOS won't give us UID when using Ndef tech
				await NfcManager.requestTechnology(
					[NfcTech.MifareIOS, NfcTech.Iso15693IOS, NfcTech.IsoDep], 
					{  alertMessage: 'Ready to do some custom Mifare cmd!'  }
				);
			} else {
				await NfcManager.requestTechnology(NfcTech.Ndef);
			}
			
			let tag = await NfcManager.getTag();

			if(tag){
				if (Platform.OS === 'ios') {
					await NfcManager.setAlertMessageIOS('Successfully read NDEF');
				}
			}

			result = true;

			let para = { option : 'read', nfc_id : tag.id }

			let api_result = await callApi2('', para);

			print(api_result);

			this.setState({tag_id : tag.id, datas : api_result['result']['datas'], view_datas : JSON.stringify(api_result['result']['datas'], null, 2) });

		}catch(e){
			print(e);
		}
		
		NfcManager.cancelTechnologyRequest().catch(() => 0);
		return result;

		
	}

	render() {
		let {datas} = this.state;
		let img = null;

		if(datas.length != 0){
			img = (<Image source = {{ uri: datas[0]['image']}} style={{width : 200, height : 200 }}/>);
		}

		return (
			<View style={{ flex: 1,}}>
				<ScrollView>

				<TouchableOpacity style={{ margin : 10, justifyContent : 'center', alignItems : 'center', backgroundColor : '#339af0', borderRadius : 50}} onPress={() => this.readNdef()}>
					<View style={{marginBottom : 20}} />

					<View style={{width : 50, height : 50, borderRadius : 50, justifyContent : 'center', alignItems : 'center', marginBottom : 15}}>
						<Icon name={'tags'} size={30} style={{color : '#fff'}}/>
					</View>
					<Text style={{textAlign : 'center', fontWeight: 'bold', color : '#fff'}}>등록된 NFC 태그 불러오기</Text>

					<View style={{marginBottom : 20}} />
				</TouchableOpacity>

				<View style={{marginBottom : 5}} />

				<Text style={{marginBottom : 5, fontWeight : 'bold'}}>Nfc tag ID</Text>

				<Text style={{marginBottom : 5, color : '#000'}}>{this.state.tag_id}</Text>

				<TextInput
						mode="outlined"
						label="Text"
						value={this.state.view_datas}
						multiline={true}
						editable = {false}
						style={{marginBottom: 10, color : '#000', backgroundColor : '#fff', height : 300}}
					/>

				{img}

				<View style={{marginBottom : 500}} />

				</ScrollView>
			</View>
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

export default connect(mapStateToProps, matchDispatchToProps)(NfcRead);

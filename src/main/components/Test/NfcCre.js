import React, {Component} from 'react';
import { View, Text, Button, TouchableOpacity, TextInput, Linking, Image, ScrollView } from 'react-native';
import { increment, decrement } from '../../reducers/baseReducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {print, customAlert, qrBaseUrl, creTranCode, getTimestamp} from '../../import/func';
import ImagePicker from 'react-native-image-picker';
import NfcManager, {NfcEvents, Ndef, NfcTech} from 'react-native-nfc-manager';
import {callApi2, callApiFile} from '../../import/funcHTTP';

class NfcCre extends Component {
	constructor(props){
		super(props);
		this.state = {
			value : '',
			value1 : '',
			img_uri : '',
			img_info : {},
			tag_id : '',
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

			this.setState({tag_id : tag.id});

		}catch(e){
			print(e);
		}
		
		NfcManager.cancelTechnologyRequest().catch(() => 0);
		return result;
	}

	showPicker=()=>{

        // PickerDialog의 옵션 객체
        const options= {
            title:'Select Picker', //다이얼로그의 제목
            takePhotoButtonTitle: '카메라',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle: '취소',
        };
 
		/*
		"fileSize": 7617918, "height": 4032, "isVertical": true, "type": "image/jpeg", "uri": "file:///var/mobile/Containers/Data/Application/0E1DA0CA-0D16-4F9A-AC40-7446450E5C62/tmp/24AACE8A-2712-46EF-BF51-6E1E211E84D6.jpg", "width": 3024}
		*/
        //위에서 만든 옵션을 기준으로 다이얼로그 보이기 
        ImagePicker.showImagePicker(options, (res)=>{
			print('res');
			this.setState({ img_uri : res.uri, img_info : { fileSize: res.fileSize, height: res.height, isVertical: res.isVertical, type: res.type, uri : res.uri} });
		});
 
	}
	
	async writeNdef() {
		let result = false;
		let nfc_code = creTranCode();

		try {
			// Step 1
			await NfcManager.requestTechnology(NfcTech.Ndef, {
				alertMessage: 'Ready to write some NDEF',
			});

			const bytes = Ndef.encodeMessage([Ndef.textRecord(nfc_code)]);

			if (bytes) {
				await NfcManager.ndefHandler // Step2
					.writeNdefMessage(bytes); // Step3

				if (Platform.OS === 'ios') {
					await NfcManager.setAlertMessageIOS('Successfully write NDEF');
				}
			}

			if(this.state.read_only && Platform.OS == 'android'){
				await NfcManager.ndefHandler.makeReadOnly();
			}

			result = true;
		} catch (ex) {
			print('catch');
			console.warn(ex);
		}

		// Step 4
		NfcManager.cancelTechnologyRequest().catch(() => 0);
		// return result;

		if(result){
			let {img_info, tag_id, value, value1, } = this.state;
			let body = new FormData();

			let para = {uri: img_info.uri,name: getTimestamp() + '.png', filename : getTimestamp() + '.png' , type: img_info.type};
	
			body.append('option', 'write');
			body.append('nfc_id', tag_id);
			body.append('nfc_code', nfc_code);
			body.append('title', value);
			body.append('description', value1);
			body.append('file', para);
			body.append('Content-Type', 'image/png');

			let api_result = await callApiFile('', body);
			print(api_result);
		}
	}

	render() {
		const {value, value1, img_uri, tag_id} = this.state;
		let image = null;

		if(img_uri != ''){
			image = (
				<Image source = {{ uri: img_uri}} style={{width : 200, height : 200 }}/>
			);
		}

		if(img_uri == undefined){
			image = null;
		}
		return (
			<View style={{ flex: 1,  }}>
				<ScrollView>
				<View style={{marginBottom : 20}}/>

				<View style={{backgroundColor: 'rgba(255,255,255,1)', padding : 20, borderRadius : 50}}>
					<View style={{marginBottom : 5}} />

					<Text style={{marginBottom : 5, fontWeight : 'bold'}}>Nfc tag ID</Text>

					<Text style={{marginBottom : 5, color : '#000'}}>{tag_id}</Text>

					<TouchableOpacity style={{ margin : 10, justifyContent : 'center', alignItems : 'center', backgroundColor : '#339af0', borderRadius : 50}} onPress={() => this.readNdef()}>
						<View style={{marginBottom : 20}} />

						<View style={{width : 50, height : 50, borderRadius : 50, justifyContent : 'center', alignItems : 'center', marginBottom : 15}}>
							<Icon name={'tags'} size={30} style={{color : '#fff'}}/>
						</View>
						<Text style={{textAlign : 'center', fontWeight: 'bold', color : '#fff'}}>NFC 태그 id 불러오기</Text>

						<View style={{marginBottom : 20}} />
					</TouchableOpacity>

					<View style={{marginBottom : 5}} />

					<Text style={{marginBottom : 5, fontWeight : 'bold'}}>제목</Text>

					<View style={{marginBottom : 5}} />

					<TextInput
						mode="outlined"
						label="Text"
						value={value}
						multiline={false}
						onChangeText={(value) => this.setState({value})}
						style={{marginBottom: 10, color : '#000', backgroundColor : '#e7eaed', height : 50}}
					/>

					<View style={{marginBottom : 5}} />

					<Text style={{marginBottom : 5, fontWeight : 'bold'}}>사진</Text>

					{image}

					<TouchableOpacity style={{ margin : 10, justifyContent : 'center', alignItems : 'center', backgroundColor : '#339af0', borderRadius : 50}} onPress={() => this.showPicker()}>
						<View style={{marginBottom : 20}} />

						<View style={{width : 50, height : 50, borderRadius : 50, justifyContent : 'center', alignItems : 'center', marginBottom : 15}}>
							<Icon name={'camera'} size={30} style={{color : '#fff'}}/>
						</View>
						<Text style={{textAlign : 'center', fontWeight: 'bold', color : '#fff'}}>사진 등록하기</Text>

						<View style={{marginBottom : 20}} />
					</TouchableOpacity>

					<View style={{marginBottom : 5}} />

					<Text style={{marginBottom : 5, fontWeight : 'bold'}}>상세 설명</Text>

					<TextInput
						mode="outlined"
						label="Text"
						value={value1}
						multiline={false}
						onChangeText={(value1) => this.setState({value1})}
						style={{marginBottom: 10, color : '#000', backgroundColor : '#e7eaed', height : 50}}
					/>

					<View style={{marginBottom : 5}} />

					<TouchableOpacity style={{ margin : 10, justifyContent : 'center', alignItems : 'center', backgroundColor : '#339af0', borderRadius : 50}} onPress={() => this.writeNdef()}>
						<View style={{marginBottom : 20}} />

						<View style={{width : 50, height : 50, borderRadius : 50, justifyContent : 'center', alignItems : 'center', marginBottom : 15}}>
							<Icon name={'share'} size={30} style={{color : '#fff'}}/>
						</View>
						<Text style={{textAlign : 'center', fontWeight: 'bold', color : '#fff'}}>해당 태그 등록하기</Text>

						<View style={{marginBottom : 20}} />
					</TouchableOpacity>
				
				</View>

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

export default connect(mapStateToProps, matchDispatchToProps)(NfcCre);

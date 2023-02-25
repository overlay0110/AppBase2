import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Loading from '../../import/Loading';
import {print, customAlert} from '../../import/func';
import {increment} from '../../reducers/baseReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import NfcManager, {NfcEvents, Ndef, NfcTech} from 'react-native-nfc-manager';

const QrScan = props => {
	const onSuccess = async (e) => {
        print(e);

        // print(props.navigation.state.params);

        if(props.navigation.state != undefined){
            const { type } = props.navigation.state.params;

            if(type == 'nfc'){
                await writeNdef({type: 'TEXT', value : e.data });
            }
        }
    }

    const writeNdef = async ({type, value}) => {
		let result = false;

		try {
			// Step 1
			await NfcManager.requestTechnology(NfcTech.Ndef, {
				alertMessage: 'Ready to write some NDEF',
			});

			const bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);

			if (bytes) {
				await NfcManager.ndefHandler // Step2
					.writeNdefMessage(bytes); // Step3

				if (Platform.OS === 'ios') {
					await NfcManager.setAlertMessageIOS('Successfully write NDEF');
				}
			}

			result = true;
		} catch (ex) {
			console.warn(ex);
		}

		// Step 4
		NfcManager.cancelTechnologyRequest().catch(() => 0);
		return result;
	}

    return (
        <QRCodeScanner
            onRead={onSuccess}
            topContent={
                <Text style={styles.centerText}>
                Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
                </Text>
            }
            bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                    <Text style={styles.buttonText}>OK. Got it!</Text>
                </TouchableOpacity>
            }
        />
    );
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(QrScan)

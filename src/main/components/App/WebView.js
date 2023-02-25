import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, StatusBar, Platform } from 'react-native';
import { urlChange } from '../../reducers/webViewReducer';
import { getLocation } from '../../reducers/locationReducers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { WebView } from 'react-native-webview';
import { print, getConfig, postData } from '../../import/func';
import RNExitApp from 'react-native-exit-app';
import strings from '../../assets/locale';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

// 아이폰 상단바 높이 설정
const Height = () => {
    if (isIphoneX()) {
        return getBottomSpace();
    } else {
        return getStatusBarHeight(true);
    }
};

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? Height() : 0;
const STATUS_BAR_COLOR = getConfig().STATUS_BAR_COLOR;
const STATUS_BAR_STYLE = getConfig().STATUS_BAR_STYLE;

class Screen extends Component {
    constructor(props){
		super(props);
		this.state = {
		}
		this.didFocus = props.navigation.addListener("didFocus", payload => {
			BackHandler.addEventListener("hardwareBackPress", this.onBack);
		});
        var webview = null;
	}

    componentDidMount(){
		this.willBlur = this.props.navigation.addListener("willBlur", payload =>
			BackHandler.removeEventListener("hardwareBackPress", this.onBack),
		);
	}

	componentWillUnmount() {
		this.exitApp = false;
		this.didFocus.remove();
		this.willBlur.remove();
		BackHandler.removeEventListener("hardwareBackPress", this.onBack);
	}

    onBack = () => {
        if(this.props.state.access_url == this.props.configLog.URL){
            if (this.exitApp == undefined || !this.exitApp) {
    			ToastAndroid.show(strings.finish_mess, ToastAndroid.SHORT);
    			this.exitApp = true;
    			this.timeout = setTimeout(
    				() => {
    					this.exitApp = false;
    				},
    				2000    // 2초
    			);
    		} else {
    			clearTimeout(this.timeout);
    			RNExitApp.exitApp();  // 앱 종료
    		}
    		return true;
        }
        else{
            this.webview && this.webview.goBack();
            return true;
        }
    }
    
    urlChange(webViewState){
        let url = webViewState.url;
        const config = this.props.configLog;

        if(url.match('app_location') == 'app_location' && config.LOCATION == true){
            this.props.getLocation();
            this.webview.goBack();
        }

        this.props.urlChange(webViewState);
    }

    render() {
        print(this.props.state.access_url);
		//print(this.props.configLog)

		let iosHeader = null;
		let iosFooter = null;

		if(Platform.OS == 'ios'){
			iosHeader = (
				<View style={{width: "100%",height: STATUS_BAR_HEIGHT,backgroundColor:STATUS_BAR_COLOR}}>
					<StatusBar backgroundColor={STATUS_BAR_COLOR} barStyle={STATUS_BAR_STYLE}/>
				</View>
			);

			if (isIphoneX()) {
				iosFooter = (
					<View style={{width:"100%",height:25,backgroundColor:STATUS_BAR_COLOR}}/>
				);
			}
        }
        
        let send_data = {};
		let send_set = {};
		let method = 'get';

        send_data['token'] = this.props.fcmToken;

        if(this.props.configLog.LOCATION == true){
            send_data['latitude'] = this.props.latitude;
            send_data['longitude'] = this.props.longitude;
            send_data['location_err_msg'] = this.props.location_err_msg;
            send_data['location_error'] = this.props.location_error;
        }

		if(method == 'get'){
			send_set = { uri: this.props.configLog.URL + '?' + postData(send_data),  method:'GET' };
		}
		else{
			send_set = { uri: this.props.configLog.URL, body:postData(send_data), method:'POST' }
		}

        webViewSet = {
            ref : r => {this.webview = r},
            source : send_set,
            onNavigationStateChange : this.urlChange.bind(this),
            cacheEnabled : false,
        }
        return (
			<View style={{flex:1}}>
				{iosHeader}
				<WebView {...webViewSet} />
				{iosFooter}
			</View>
        );
    }
}

// Reducer 데이터를 props로 변환
function mapStateToProps(state){
    return {
        state: state.webViewReducer,
        configLog : state.commonReducer.configLogInfo,
        fcmToken : state.commonReducer.fcmToken,

        latitude : state.locationReducers.latitude,
        longitude : state.locationReducers.longitude,
        location_error : state.locationReducers.location_error,
        location_err_msg : state.locationReducers.location_err_msg,
    };
}

// Actions을 props로 변환
function matchDispatchToProps(dispatch){
    return bindActionCreators({
        urlChange : urlChange,
        getLocation : getLocation,
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Screen);

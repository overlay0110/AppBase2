import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform, TextInput, TouchableOpacity, PermissionsAndroid, PanResponder } from 'react-native';
import Loading from '../../import/Loading';
import {print, customAlert} from '../../import/func';
import {increment} from '../../reducers/baseReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {  NodePlayerView, NodeCameraView } from 'react-native-nodemediaclient';
import { rn_footer2 } from '../../import/appBase2';
import Video from 'react-native-video';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';

class Streaming extends Component {
    constructor(props){
		super(props);
		this.state = {
            isPublish : false,
            publishBtnTitle: 'Start Publish',
            screen : 'view',
			v_id : 'rtmp://192.168.1.18/live/ray',
			o_id : 'rtmp://192.168.1.18/live/ray',
            msgs : ['Chat start!!'],
		}

        this.socket = SocketIOClient('http://192.168.1.18:3000');

        this._getReply = this._getReply.bind(this);

        this.socket.on('chatMessage', this._getReply);

	}

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        });

        this._previousLeft = 20;
        this._previousTop = 84;
        this._circleStyles = {
            style: {
                left: this._previousLeft,
                top: this._previousTop,
            }
        };
    }

    _updatePosition = () => {
        this.circle && this.circle.setNativeProps(this._circleStyles);
    }

    _handleStartShouldSetPanResponder = (e: Object, gestureState: Object) => {
        return true;
    }

    _handleMoveShouldSetPanResponder = (e: Object, gestureState: Object) => {
        return true;
    }

    _handlePanResponderMove = (e: Object, gestureState: Object) => {
        this._circleStyles.style.left = this._previousLeft + gestureState.dx;
        this._circleStyles.style.top = this._previousTop + gestureState.dy;
        this._updatePosition();
    }

    _handlePanResponderEnd = (e: Object, gestureState: Object) => {
        this._previousLeft += gestureState.dx;
        this._previousTop += gestureState.dy;
    }

	componentDidMount(){
		this.requestCameraPermission();
        this._updatePosition();
	}

	componentWillUnmount() {
		// this.didFocus.remove();
	}

    _getReply(data){
		//get reply from socket server, log it to console
        if(this.state.msgs > 10){
            this.setState({msgs : this.state.msgs.concat(data).slice(1)});
        }
        else{
            this.setState({msgs : this.state.msgs.concat(data)});
        }

        this.scrollView && this.scrollView.scrollToEnd({animated: false});

        // if(this.state.msgs > 20){
        //     this.state.msgs.shift();
        // }
		// console.log('Reply from server:' + data);
	}

    async requestCameraPermission(){
        try {
            const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
                {
                    title: "Cool Photo App Camera And Microphone Permission",
                    message:
                    "Cool Photo App needs access to your camera " +
                    "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                    console.log("Camera permission denied");
            }
        } catch (err) {
                console.warn(err);
        }
    };

    changeScreen(){
        if(this.state.screen == 'view'){
            this.setState({screen : 'cast'});
        }
        else{
            this.setState({screen : 'view'});
            this.vb.stop();
        }
    }

    render(){
        let o_url = this.state.o_id;
		let v_url = this.state.v_id;

        if(this.state.screen == 'view'){
            // return (
            //     <View style={{flex : 1}}>
            //         <Video
            //             source={{uri: "http://192.168.1.18:8000/live/ray/index.m3u8"}}
            //             ref={(ref) => {
            //                 this.player = ref
            //             }}  // Store reference
            //             onBuffer={() => console.log('onBuffer')} // Callback when remote video is buffering
            //             onError={() => console.log('onError')} // Callback when video cannot be loaded
            //             style={{height : 200}} />
            //         <Text>View</Text>
			// 		<TextInput placeholder='id' style={[]} value={this.state.v_id} onChangeText={(v_id) => this.setState({v_id})} />
            //         {rn_footer2({func : this.changeScreen.bind(this)})}
            //     </View>
            // );
            return (
                <View style={{flex : 1}}>
                    <NodePlayerView
                        style={{ height : '100%', backgroundColor : '#000', }}
                        ref={(vp2) => { this.vp2 = vp2 }}
                        inputUrl={v_url}
                        scaleMode={"ScaleAspectFit"}
                        bufferTime={300}
                        maxBufferTime={1000}
                        autoplay={true}
                    />
                    <View
                        style={[{ position:'absolute',height : 200, width : '50%', backgroundColor : 'rgba(255,255,255,0.4)', paddingTop : 50}]}
                        ref={(circle) => {
                            this.circle = circle
                        }}
                        {...this._panResponder.panHandlers}
                    >
                        <ScrollView
                            ref={ref => this.scrollView = ref}
                            onContentSizeChange={(contentWidth, contentHeight)=>{
                                this.scrollView.scrollToEnd({animated: false});
                            }}
                        >
                            {this.state.msgs.map( msg => (
                                <Text style={{fontSize : 20, color : 'rgba(0,0,0,0.8)'}}>{msg}</Text>
                            ))}
                        </ScrollView>
                    </View>
                    <Text style={{position: 'absolute', color : '#fff', top : 0, fontSize : 30}}>View</Text>
					<TextInput placeholder='id' style={[{bottom : 50, position:'absolute', color : '#fff'}]} value={this.state.v_id} onChangeText={(v_id) => this.setState({v_id})} />
                    {rn_footer2({func : this.changeScreen.bind(this), footerAdd : {bottom : 0, position:'absolute',}})}
                </View>
            );
        }
        else{
            return (
                <View style={{flex : 1}}>
                    <NodeCameraView
                        style={{ flex : 1 }}
                        ref={(vb) => { this.vb = vb }}
                        outputUrl = {o_url}
                        camera={{ cameraId: 1, cameraFrontMirror: true }}
                        audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                        video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
                        autopreview={true}
                    />

					<TextInput placeholder='id' style={[]} value={this.state.o_id} onChangeText={(o_id) => this.setState({o_id})} />


                    <Button
                        onPress={() => {
                            if (this.state.isPublish) {
                                this.setState({ publishBtnTitle: 'Start Publish', isPublish: false });
                                this.vb.stop();
                            } else {
                                this.setState({ publishBtnTitle: 'Stop Publish', isPublish: true });
                                this.vb.start();
                            }
                        }}
                        title={this.state.publishBtnTitle}
                        color="#841584"
                    />

                    {rn_footer2({func : this.changeScreen.bind(this)})}

                </View>
            );
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Streaming)

import { View, Text } from 'react-native';
import PatternLock from './PatternLock';
import Chat from './Chat';
import FingerSample from './FingerSample';
import List from './List';
import PinSample from './PinSample';
import QrScan from './QrScan';
import Screen from './Screen';
import Streaming from './Streaming';

router = {
    PatternLock: { screen : PatternLock },
    FingerSample: { screen : FingerSample },
    PinSample: { screen : PinSample },
    Streaming: { screen : Streaming, navigationOptions : {headerShown: false} },
    Chat: { screen : Chat,  navigationOptions : {headerShown: false} },
    QrScan: { screen : QrScan },
    List: { screen : List },
	Screen : { screen : Screen },
}

export default router;

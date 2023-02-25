import { View, Text } from 'react-native';
import Main from "./Main";
import WebView from "./WebView";

router = {
	Main: { screen: Main },
	WebView : { screen : WebView, navigationOptions : {headerShown: false} },
}

export default router;

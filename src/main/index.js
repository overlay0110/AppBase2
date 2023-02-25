import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import App from './components/App';
import Test from './components/Test';
import Lock from './components/Lock';
import LayoutHeader from './import/header';
import { View, Text } from 'react-native';

const AppNavigator = createStackNavigator(
	{
		...App,
		...Test,
        ...Lock,
	},
	{
		initialRouteName: 'Load',
		//headerMode: 'none',

	}
);

export default createAppContainer(AppNavigator);

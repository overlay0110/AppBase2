import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import styles from './FingerprintPopup.component.styles';
import ShakingText from './ShakingText.component';
//import strings from "../../../assets/locale/strings";

class FingerprintPopup extends Component {

  constructor(props) {
    super(props);
    this.state = { errorMessage: undefined };
  }

  componentDidMount() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttempted })
      .then(() => {
        this.props.handlePopupDismissed();
        this.props.navigation.navigate(this.props.navigation.state.params.endpoint);
        // Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
      })
      .catch((error) => {
        console.log('FingerprintPopup Android ', error.message);
        this.setState({ errorMessage: error.message });
        this.description.shake();
      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  handleAuthenticationAttempted = (error) => {
    this.setState({ errorMessage: error.message });
    this.description.shake();
  };

  render() {
    const { errorMessage } = this.state;
    const { style, handlePopupDismissed } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>

          <Image
            style={styles.logo}
            source={require('./assets/finger_print.png')}
          />

          <Text style={styles.heading}>
            Fingerprint{'\n'}Authentication
          </Text>
          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={styles.description(!!errorMessage)}>
            {errorMessage || 'finger_input'}
          </ShakingText>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissed}
          >
            <Text style={styles.buttonText}>
              Back to main
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

// 'Scan your fingerprint on the\ndevice scanner to continue'

FingerprintPopup.propTypes = {
  style: ViewPropTypes.style,
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;

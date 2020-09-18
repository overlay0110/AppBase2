import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AlertIOS } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
//import strings from "../../../assets/locale/strings";

class FingerprintPopup extends Component {

  componentDidMount() {
    FingerprintScanner
      .authenticate({ description: 'finger_input' })
      .then(() => {
        this.props.handlePopupDismissed();
        // AlertIOS.alert('Authenticated successfully');
        this.props.navigation.navigate(this.props.navigation.state.params.endpoint);
      })
      .catch((error) => {
        this.props.handlePopupDismissed();
        console.log('FingerprintPopup IOS ', error.message);
        AlertIOS.alert(error.message);

      });
  }

  render() {
    return false;
  }
}

FingerprintPopup.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;

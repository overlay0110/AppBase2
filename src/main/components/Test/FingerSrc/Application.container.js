import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  View
} from 'react-native';
import { Container, Body, Content, Header, Left, Right, Icon, Title, Input, Item, Label, Button, List, ListItem, Footer, Text } from "native-base";
import FingerprintScanner from 'react-native-fingerprint-scanner';

import styles from './Application.container.styles';
import FingerprintPopup from './FingerprintPopup.component';
//import strings from "../../../assets/locale/strings";

class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      popupShowed: false,
      word: 'Hey',
    };
  }

  handleFingerprintShowed = () => {
    this.setState({ popupShowed: true });
  };

  handleFingerprintDismissed = () => {
    this.setState({ popupShowed: false });
  };

  componentDidMount() {
    FingerprintScanner
      .isSensorAvailable()
      .catch(error => this.setState({ errorMessage: error.name }));

      // error.name : "FingerprintScannerNotEnrolled",
  }

  render() {
    const { errorMessage, popupShowed } = this.state;

    return (
        <Container>
          <Header style={{ backgroundColor: '#005085', borderColor: '#005085', borderBottomWidth: 0 }}>
            <Left>
                <Button transparent onPress={() => this.props.navigation.navigate("Main")}>
                  <Icon name="arrow-back" style={{ color : '#fff' }} />
				</Button>
            </Left>
            <Body>
              <Title></Title>
            </Body>
            <Right />
          </Header>
          <Content style={{ backgroundColor: '#005085' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flex: 1,}}>
              <Text style={styles.heading}>
                CUBE Wallet Fingerprint Scanner
              </Text>
              <Text style={styles.subheading}>
                {'지문인식타이틀'}
              </Text>

              <TouchableOpacity
                style={styles.fingerprint}
                onPress={this.handleFingerprintShowed}
                disabled={errorMessage}
              >
                <Image source={require('./assets/finger_print.png')} style={{ marginBottom: 20 }}/>
                <Text style={styles.subheading} >{'지문인식하기'}</Text>
              </TouchableOpacity>

              {errorMessage && (
                <Text style={styles.errorMessage}>
                  {errorMessage}
                </Text>
              )}

              {popupShowed && (
                <FingerprintPopup
                  style={styles.popup}
                  handlePopupDismissed={this.handleFingerprintDismissed}
                  navigation={this.props.navigation}
                />
              )}

          </Content>
        </Container>
    );
  }
}

export default Application;

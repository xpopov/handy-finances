/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Amplify from '@aws-amplify/core'
import {Authenticator, Greetings, SignIn, SignUp, ConfirmSignIn, ConfirmSignUp, 
  RequireNewPassword, ForgotPassword, VerifyContact, Loading, TOTPSetup} from 'aws-amplify-react-native'
import awsconfig from './aws-exports'

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
})

import { API, graphqlOperation } from 'aws-amplify';

const ListAccountsQuery = `
  query {
    listAccounts {
      items {
        id name description
      }
    }
  }
  `;

class CustomAuthenticator extends Authenticator {
  constructor(props) {
    super(props);
  }
}

class ListAccounts extends React.Component {
  state = {
    accounts: []
  }
  async componentDidMount() {
    try {
      const accounts = await API.graphql(graphqlOperation(ListAccountsQuery));
      console.log('accounts: ', accounts);
      console.log('items: ', accounts.data.listAccounts.items);
      this.setState({ accounts: accounts.data.listAccounts.items });
    } catch (err) {
      console.log('error: ', err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.accounts.map((account, index) => (
          <View key={index} style={styles.account}>
            <Text style={styles.name}>{account.name}</Text>
            <Text style={styles.description}>{account.description}</Text>
          </View>
        ))}
      </View>
    );
  }
}

const App = (props) => {
  console.log(props);
  const loggedIn = props && props.authState == "signedIn";
  if (loggedIn)
  return (
    <>
      <View style={styles.sectionTopContainer}>
        <Icon name="comments" size={30} color="#900" />
        <Text style={styles.sectionTitle}>Accounts</Text>
        <ListAccounts />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>See Your Changes</Text>
        <Text style={styles.sectionDescription}>
          <ReloadInstructions />
        </Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Debug</Text>
        <Text style={styles.sectionDescription}>
          <DebugInstructions />
        </Text>
      </View>
    </>
  );
  else return null;
};

const AppWithAuth: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
          {/* <Header /> */}
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <CustomAuthenticator 
              usernameAttributes="email"
              onStateChange={ (authState) => console.log(authState) }
              hideDefault={true}>
              <Greetings/>
              <SignIn/>
              <ConfirmSignIn/>
              <RequireNewPassword/>
              <SignUp/>
              <ConfirmSignUp/>
              <VerifyContact/>
              <ForgotPassword/>
              {/* <TOTPSetup/> */}
              <Loading/>
              <App/>
            </CustomAuthenticator>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionTopContainer: {
    marginTop: 12,
    paddingHorizontal: 24,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default AppWithAuth;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
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

import { graphqlMutation } from 'aws-appsync-react';

const ListAccountsQuery = `
  query {
    listAccounts {
      items {
        id name description
      }
    }
  }
`;
const AddAccountQuery = `
  mutation ($name: String! $description: String) {
    createAccount(input: {
      name: $name
      description: $description
    }) {
      id name description
    }
  }
`;
const UpdateAccountQuery = `
  mutation ($id: ID! $name: String! $description: String) {
    updateAccount(input: {
      id: $id
      name: $name
      description: $description
    }) {
      id name description
    }
  }
`;

function removeEmptyStringElements(obj) {
  for (var prop in obj) {
    if (typeof obj[prop] === 'object') {// dive deeper in
      removeEmptyStringElements(obj[prop]);
    } else if(obj[prop] === '') {// delete elements that are empty strings
      // delete obj[prop];
      obj[prop] = '\0';
    }
  }
  return obj;
}

class CustomAuthenticator extends Authenticator {
  constructor(props) {
    super(props);
  }
}

const AccountListItem = (props) => (
  <View key={props.index} style={styles.account}>
    <Text onPress={ () => props.handleClick(props.item) } style={styles.name}>{props.item.name}</Text>
    <Text style={styles.description}>{props.item.description}</Text>
  </View>
)

class ListAccounts extends React.Component {
  state = {
    id: null,
    name: '',
    description: '',
    accounts: []
  }
  resetEdit() {
    this.setState({ id: null, name: '', description: ''});
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
  };
  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };
  handleNavigateToAccount = (item) => {
    this.setState({ id: item.id, name: item.name, description: item.description })
  };
  addAccount = async () => {
    if (this.state.name === '') return;
    const account = removeEmptyStringElements({ name: this.state.name, description: this.state.description });
    try {
      const accounts = [...this.state.accounts, account];
      this.setState({ accounts, name: '', description: '' });
      console.log('accounts: ', accounts);
      await API.graphql(graphqlOperation(AddAccountQuery, account));
      console.log('success');
      this.resetEdit();
    } catch (err) {
      console.log('error: ', err);
    }
  };
  updateAccount = async () => {
    if (this.state.id === '' || this.state.name === '') return;
    const account = removeEmptyStringElements({ id: this.state.id, name: this.state.name, description: this.state.description });
    try {
      var accounts = this.state.accounts;
      accounts = accounts.map((a) => {
        if (a.id == this.state.id) {
          a.name = this.state.name;
          a.description = this.state.description;
        }
        return a;
      });
      this.setState({ accounts, name: '', description: '' });
      console.log('accounts: ', accounts);
      await API.graphql(graphqlOperation(UpdateAccountQuery, account));
      console.log('success');
      this.resetEdit();
    } catch (err) {
      console.log('error: ', err);
    }  
  };
  render() {
    return (
      <>
        <View style={styles.container}>
          <TextInput
                style={styles.input}
                value={this.state.name}
                onChangeText={val => this.onChangeText('name', val)}
                placeholder="Name"
          />
          <TextInput
                style={styles.input}
                value={this.state.description}
                onChangeText={val => this.onChangeText('description', val)}
                placeholder="Description"
          />
          {
            this.state.id == null ? 
              (<Button onPress={this.addAccount} title="Add Account" color="#eeaa55" />):
              (<Button onPress={this.updateAccount} title="Update Account" color="#eeaa55" />)
          }
          
        </View>
        <View style={styles.container}>
          <FlatList
            data={this.state.accounts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <AccountListItem
                handleClick={ (item) => { this.handleNavigateToAccount(item)} }
                onCaretPress={this.handleDrillDown}
                item={item}
              />
            )}
          />
          { /* this.state.accounts.map((account, index) => (
            <View key={index} style={styles.account}>
              <Text style={styles.name}>{account.name}</Text>
              <Text style={styles.description}>{account.description}</Text>
            </View>
          )) */}
        </View>
      </>
    );
  }
}

graphqlMutation(CreateAccountQuery, ListAccountsQuery, 'Account')

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
    paddingTop: 24,
    paddingBottom: 24
  },
  container: {
    marginTop: 10,
    marginBottom: 10
  },
  sectionTopContainer: {
    marginTop: 150,
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

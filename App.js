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

import awsconfig from './aws-exports';
import { listAccounts } from './src/graphql/queries';
import { createAccount, deleteAccount } from './src/graphql/mutations';
import { onCreateAccount, onUpdateAccount, onDeleteAccount } from './src/graphql/subscriptions';

import gql from 'graphql-tag';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import AWSAppSyncClient, { buildSubscription } from 'aws-appsync';
import { Rehydrated, graphqlMutation } from 'aws-appsync-react';
import { compose, graphql, ApolloProvider } from 'react-apollo';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
})

// let token = await Auth.currentSession().then(session => session.getIdToken().getJwtToken()) // Cognito

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: awsconfig.aws_appsync_authenticationType,
    jwtToken: (async () =>  {
      const currentSession = await Auth.currentSession();
      return currentSession.getIdToken().getJwtToken()
    })
    // apiKey: awsconfig.aws_appsync_apiKey
  }
})

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
  constructor(props) {
    super(props);
    this.state = this.updateState(props);
  }
  updateState(props) {
    return {
      id: null,
      name: '',
      description: '',
      accounts: props ? props.accounts : []
    };
  }
  componentDidUpdate(prevProps) {
    if(prevProps.accounts !== this.props.accounts) {
      // this.setState({value: this.props.value});
      this.setState(this.updateState(this.props));
    }
  }
  resetEdit() {
    this.setState({ id: null, name: '', description: ''});
  }
  // async componentDidMount() {
  //   try {
  //     const accounts = await API.graphql(graphqlOperation(ListAccountsQuery));
  //     console.log('accounts: ', accounts);
  //     console.log('items: ', accounts.data.listAccounts.items);
  //     this.setState({ accounts: accounts.data.listAccounts.items });
  //   } catch (err) {
  //     console.log('error: ', err);
  //   }
  // };
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
    console.log(this.state.accounts);
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


class App extends React.Component {
  constructor(props) {
    console.log(props.data);
    console.log(props.data.listAccounts);
    super(props);
    this.state = {
      accounts: props.accounts,
      loggedIn: props && (props.authState == "signedIn" || props.authState == "loading"),
      // data: props.data
    };
  }
  
  async componentDidMount() {
    // console.log(this.state.data)
    console.log(buildSubscription(gql(onUpdateAccount), gql(listAccounts)));
    session = await Auth.currentSession();
    owner = session && session.getIdToken().payload.sub;
    console.log(owner);
    if (this.props && this.props.data) {
      options = buildSubscription(gql(onCreateAccount), gql(listAccounts));
      options = { ...options,
        variables: {
          // owner: owner
        }
      };
      console.log(options);
      // this.props.data.subscribeToMore(options);

      // options = buildSubscription(gql(onUpdateAccount), gql(listAccounts));
      // options = { ...options,
      //   variables: {
      //     owner: owner
      //   }
      // };
      // this.state.data.subscribeToMore(options);
    }

    this.createItemListener = API.graphql(
      graphqlOperation(onCreateAccount)
    ).subscribe({
      next: updateItemResult => {
        // console.log(updateItemResult);
        console.log("updateItemResult from subscription", JSON.stringify(updateItemResult.value.data, null, 2));
        const account = updateItemResult.value.data.onCreateAccount;
        const accounts = [...this.state.accounts, account];
        // console.log(accounts);
        this.props.accounts = [...this.props.accounts, account];
        this.setState({ accounts: accounts });
      }
    });
  }

  render() {
    if (this.state.loggedIn)
    return (
      <>
        <View style={styles.sectionTopContainer}>
          <Icon name="comments" size={30} color="#900" />
          <Text style={styles.sectionTitle}>Accounts</Text>
          <ListAccounts accounts={this.state.accounts} />
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
  }
};

const AppSynced = //compose(
  // graphqlMutation(gql(onUpdateAccount), gql(listAccounts), 'ListAccounts'),
  graphql(
    gql(listAccounts), 
    {
      options: {
        fetchPolicy: "cache-and-network"
      },
      props: props => ({
        accounts: props.data.listAccounts ? props.data.listAccounts.items : [],
        data: props.data
      })
    }
  //)
)(App);


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
    paddingTop: 150,
    paddingBottom: 150
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



// () => React$Node
export default class AppWithAuth extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
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
                  <SignIn/>
                  <ConfirmSignIn/>
                  <RequireNewPassword/>
                  <SignUp/>
                  <ConfirmSignUp/>
                  <VerifyContact/>
                  <ForgotPassword/>
                  {/* <TOTPSetup/> */}
                  <Greetings/>
                  <Loading/>
                  <AppSynced/>
                </CustomAuthenticator>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Rehydrated>
      </ApolloProvider>
    );
  }
};

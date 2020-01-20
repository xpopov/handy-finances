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

// import {
//   Colors,
//   // DebugInstructions,
//   // ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// console.log(Colors);

// import Icon from 'react-native-vector-icons/FontAwesome5';

import Amplify from '@aws-amplify/core'
import {Authenticator, Greetings, SignIn, SignUp, ConfirmSignIn, ConfirmSignUp, 
  RequireNewPassword, ForgotPassword, VerifyContact, Loading, TOTPSetup} from 'aws-amplify-react-native'

import gql from 'graphql-tag';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import AWSAppSyncClient, { buildSubscription } from 'aws-appsync';
import { Rehydrated, graphqlMutation } from 'aws-appsync-react';
import { compose, graphql, ApolloProvider } from 'react-apollo';

import ApplicationList from './pages/application_list';

import styles from './styles';
import awsconfig from '../aws-exports';
import { listAccounts } from './graphql/queries';
import { createAccount, deleteAccount } from './graphql/mutations';
import { onCreateAccount, onUpdateAccount, onDeleteAccount } from './graphql/subscriptions';

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



class App extends React.Component {
  constructor(props) {
    console.log("App props");
    console.log(props);
    super(props);
    this.state = {
      // accounts: props.accounts,
      loggedIn: props && (props.authState == "signedIn"/* || props.authState == "loading"*/),
      // data: props.data
    };
  }
  
  async componentDidMount() {
    // console.log(this.state.data)
    // console.log(buildSubscription(gql(onUpdateAccount), gql(listAccounts)));
    session = await Auth.currentSession();
    owner = session && session.getIdToken().payload.sub;
    // console.log(owner);
    if (this.props && this.props.data) {
      // options = buildSubscription(gql(onCreateAccount), gql(listAccounts));
      // options = { ...options,
      //   variables: {
      //     // owner: owner
      //   }
      // };
      // console.log(options);
      // this.props.data.subscribeToMore(options);
      this.props.data.subscribeToMore({
        document: gql(onCreateAccount),
        variables: {
          // param: nextProps.subscriptionParam,
        },
        // updateQuery: (previousResult, { subscriptionData, variables }) => {
        //   // Perform updates on previousResult with subscriptionData
        //   return updatedResult;
        // },
        updateQuery: (prev, { subscriptionData }) => {
          console.log(subscriptionData);
          console.log(prev);
          if (!subscriptionData.data) return prev;
          const newItem = subscriptionData.data.onCreateAccount;
          console.log(newItem);
          
          result = Object.assign({}, prev);
          result.listAccounts.items = [...prev.listAccounts.items, newItem];
          console.log(result);
          // this.setState({ accounts: result.listAccounts.items });
          return result;
        }
      })

      // options = buildSubscription(gql(onUpdateAccount), gql(listAccounts));
      // options = { ...options,
      //   variables: {
      //     owner: owner
      //   }
      // };
      // this.state.data.subscribeToMore(options);
    }

    // this.createItemListener = API.graphql(
    //   graphqlOperation(onCreateAccount)
    // ).subscribe({
    //   next: updateItemResult => {
    //     // console.log(updateItemResult);
    //     console.log("updateItemResult from subscription", JSON.stringify(updateItemResult.value.data, null, 2));
    //     const account = updateItemResult.value.data.onCreateAccount;
    //     const accounts = [...this.state.accounts, account];
    //     // console.log(accounts);
    //     this.props.accounts = [...this.props.accounts, account];
    //     this.setState({ accounts: accounts });
    //   }
    // });
  }

  render = () => {
    console.log("App render");
    console.log(this.props.authState);
    if (this.props.authState)
      return (
        <ApplicationList loggedIn={this.props.authState}/>
      );
    else
      return null;
  }
};

const AppSynced = App;

export default class AppWithAuth extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      signInState: null
    }
  }

  render() {
    console.log("AppWithAuth render");
    console.log(this.state);
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
                  onStateChange={ (authState) => { console.log(authState); this.setState({signInState: authState}); } }
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
                  <AppSynced authState={this.state.signInState} />
                </CustomAuthenticator>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Rehydrated>
      </ApolloProvider>
    );
  }
};

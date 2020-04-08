import React, { Component } from 'react';
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
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { Rehydrated, graphqlMutation } from 'aws-appsync-react';
import { API, Auth, graphqlOperation } from 'aws-amplify';

import { listAccounts } from '../graphql/queries';
import { createAccount, deleteAccount } from '../graphql/mutations';
import { onCreateAccount, onUpdateAccount, onDeleteAccount } from '../graphql/subscriptions';
import styles from '../styles';

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


class ApplicationList extends Component {
  render() {
    console.log('ApplicationList.render');
    console.log(this.props.loggedIn);
    console.log(this.props.accounts);
    if (this.props.loggedIn == "signedIn")
    return (
      <>
        <View style={styles.sectionTopContainer}>
          {/* <Icon name="comments" size={30} color="#900" /> */}
          <Text style={styles.sectionTitle}>Accounts</Text>
          <ListAccounts key={1} accounts={this.props.accounts} />
        </View>
        {/* <View style={styles.sectionContainer}>
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
        </View> */}
      </>
    );
    else return null;
  }
}

export default compose(
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
  ),
  graphqlMutation(gql(createAccount), gql(listAccounts), 'Account'),
)(ApplicationList);

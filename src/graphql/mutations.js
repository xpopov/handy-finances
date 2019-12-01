/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccount = `mutation CreateAccount(
  $input: CreateAccountInput!
  $condition: ModelAccountConditionInput
) {
  createAccount(input: $input, condition: $condition) {
    id
    name
    description
    snapshots {
      items {
        id
        title
        comment
        calculatedAt
        owner
      }
      nextToken
    }
    owner
  }
}
`;
export const updateAccount = `mutation UpdateAccount(
  $input: UpdateAccountInput!
  $condition: ModelAccountConditionInput
) {
  updateAccount(input: $input, condition: $condition) {
    id
    name
    description
    snapshots {
      items {
        id
        title
        comment
        calculatedAt
        owner
      }
      nextToken
    }
    owner
  }
}
`;
export const deleteAccount = `mutation DeleteAccount(
  $input: DeleteAccountInput!
  $condition: ModelAccountConditionInput
) {
  deleteAccount(input: $input, condition: $condition) {
    id
    name
    description
    snapshots {
      items {
        id
        title
        comment
        calculatedAt
        owner
      }
      nextToken
    }
    owner
  }
}
`;
export const createSnapshot = `mutation CreateSnapshot(
  $input: CreateSnapshotInput!
  $condition: ModelSnapshotConditionInput
) {
  createSnapshot(input: $input, condition: $condition) {
    id
    title
    comment
    calculatedAt
    data {
      items {
        id
        balance
        owner
      }
      nextToken
    }
    account {
      id
      name
      description
      snapshots {
        nextToken
      }
      owner
    }
    owner
  }
}
`;
export const updateSnapshot = `mutation UpdateSnapshot(
  $input: UpdateSnapshotInput!
  $condition: ModelSnapshotConditionInput
) {
  updateSnapshot(input: $input, condition: $condition) {
    id
    title
    comment
    calculatedAt
    data {
      items {
        id
        balance
        owner
      }
      nextToken
    }
    account {
      id
      name
      description
      snapshots {
        nextToken
      }
      owner
    }
    owner
  }
}
`;
export const deleteSnapshot = `mutation DeleteSnapshot(
  $input: DeleteSnapshotInput!
  $condition: ModelSnapshotConditionInput
) {
  deleteSnapshot(input: $input, condition: $condition) {
    id
    title
    comment
    calculatedAt
    data {
      items {
        id
        balance
        owner
      }
      nextToken
    }
    account {
      id
      name
      description
      snapshots {
        nextToken
      }
      owner
    }
    owner
  }
}
`;
export const createSnapshotData = `mutation CreateSnapshotData(
  $input: CreateSnapshotDataInput!
  $condition: ModelSnapshotDataConditionInput
) {
  createSnapshotData(input: $input, condition: $condition) {
    id
    balance
    snapshot {
      id
      title
      comment
      calculatedAt
      data {
        nextToken
      }
      account {
        id
        name
        description
        owner
      }
      owner
    }
    owner
  }
}
`;
export const updateSnapshotData = `mutation UpdateSnapshotData(
  $input: UpdateSnapshotDataInput!
  $condition: ModelSnapshotDataConditionInput
) {
  updateSnapshotData(input: $input, condition: $condition) {
    id
    balance
    snapshot {
      id
      title
      comment
      calculatedAt
      data {
        nextToken
      }
      account {
        id
        name
        description
        owner
      }
      owner
    }
    owner
  }
}
`;
export const deleteSnapshotData = `mutation DeleteSnapshotData(
  $input: DeleteSnapshotDataInput!
  $condition: ModelSnapshotDataConditionInput
) {
  deleteSnapshotData(input: $input, condition: $condition) {
    id
    balance
    snapshot {
      id
      title
      comment
      calculatedAt
      data {
        nextToken
      }
      account {
        id
        name
        description
        owner
      }
      owner
    }
    owner
  }
}
`;

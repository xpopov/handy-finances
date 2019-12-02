/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = `query GetAccount($id: ID!) {
  getAccount(id: $id) {
    id
    name
    description
    owner
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
  }
}
`;
export const listAccounts = `query ListAccounts(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      owner
      snapshots {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getSnapshot = `query GetSnapshot($id: ID!) {
  getSnapshot(id: $id) {
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
      owner
      snapshots {
        nextToken
      }
    }
    owner
  }
}
`;
export const listSnapshots = `query ListSnapshots(
  $filter: ModelSnapshotFilterInput
  $limit: Int
  $nextToken: String
) {
  listSnapshots(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getSnapshotData = `query GetSnapshotData($id: ID!) {
  getSnapshotData(id: $id) {
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
export const listSnapshotDatas = `query ListSnapshotDatas(
  $filter: ModelSnapshotDataFilterInput
  $limit: Int
  $nextToken: String
) {
  listSnapshotDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      balance
      snapshot {
        id
        title
        comment
        calculatedAt
        owner
      }
      owner
    }
    nextToken
  }
}
`;

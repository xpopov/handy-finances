/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = `subscription OnCreateAccount {
  onCreateAccount {
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
export const onUpdateAccount = `subscription OnUpdateAccount($id: ID!, $owner: String!) {
  onUpdateAccount(id: $id, owner: $owner) {
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
export const onCreateSnapshot = `subscription OnCreateSnapshot($owner: String!) {
  onCreateSnapshot(owner: $owner) {
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
export const onUpdateSnapshot = `subscription OnUpdateSnapshot($owner: String!) {
  onUpdateSnapshot(owner: $owner) {
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
export const onDeleteSnapshot = `subscription OnDeleteSnapshot($owner: String!) {
  onDeleteSnapshot(owner: $owner) {
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
export const onCreateSnapshotData = `subscription OnCreateSnapshotData($owner: String!) {
  onCreateSnapshotData(owner: $owner) {
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
export const onUpdateSnapshotData = `subscription OnUpdateSnapshotData($owner: String!) {
  onUpdateSnapshotData(owner: $owner) {
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
export const onDeleteSnapshotData = `subscription OnDeleteSnapshotData($owner: String!) {
  onDeleteSnapshotData(owner: $owner) {
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

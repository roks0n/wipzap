function findTodo(z, filter) {
  const query = `
    query ($filter: String) {
      viewer {
        todos(filter: $filter, completed: false, limit: 100) {
          id
          body
        }
      }
    }
  `;

  const variables = { filter: filter };
  const options = { method: 'POST', body: { query, variables } };

  return new Promise((resolve, reject) => {
    return z.request(`${process.env.BASE_URL}/graphql`, options)
      .then(response => {
        const todos = z.JSON.parse(response.content).data.viewer.todos;
        if (todos.length === 1) {
          resolve(todos[0].id);
        } else {
          // so next step in Zapier can be used (eg. if id not exists etc.)
          resolve(null);
        }
      })
      .catch(err => reject(err));
  });
}

function completeTodo(z, id) {
  const query = `
    mutation completeTodo($id: ID!, $attachments: [AttachmentInput]) {
      completeTodo(id: $id, attachments: $attachments) {
        id
        completed_at
      }
    }
  `;
  const variables = { id };
  const options = { method: 'POST', body: { query, variables } };

  return new Promise((resolve, reject) => {
    if (id === null) {
      resolve({id: null, completed_at: null});
    }

    return z.request(`${process.env.BASE_URL}/graphql`, options)
      .then((response) => {
        resolve(z.JSON.parse(response.content).data.completeTodo);
      })
      .catch(err => reject(err));
  });
}

// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'completeTodo',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Todo',
  display: {
    label: 'Find and Complete Todo',
    description: 'Find an existing todo and mark it as complete.'
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      {key: 'body', required: true, type: 'string', helpText: 'Body of the todo.'},
      {key: 'project', required: true, type: 'text', helpText: 'Name of the project this todo belongs to.'},
    ],
    perform: (z, bundle) => {
      const filter = `${bundle.inputData.body} ${bundle.inputData.project}`;
      return findTodo(z, filter).then(id => completeTodo(z, id));
    },

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 107770,
      completed_at: '2019-03-17T10:10:51Z'
    },

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'completed_at', label: 'Completed At'},
    ]
  }
};

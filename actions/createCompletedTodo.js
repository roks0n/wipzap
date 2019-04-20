// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'createCompletedTodo',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Todo',
  display: {
    label: 'Create Completed Todo',
    description: 'Create a new todo and mark it as done.'
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      {key: 'body', required: true, type: 'string', helpText: 'Body of the todo.'},
      {key: 'project', required: true, type: 'text', helpText: 'Name of the project this todo belongs to.'},
    ],
    perform: (z, bundle) => {
      const body = `${bundle.inputData.body}${ bundle.inputData.project ? ` #${bundle.inputData.project}` : '' }`;
      const query = `
        mutation createTodo($body: String!, $completed_at: DateTime, $attachments: [AttachmentInput]) {
          createTodo(input: { body: $body, completed_at: $completed_at, attachments: $attachments }) {
            id
            body
            completed_at
          }
        }
      `;

      const variables = {
        body,
        completed_at: new Date().toISOString()
      };

      const options = {
        method: 'POST',
        body: {
          query,
          variables
        }
      };

      const promise = z.request(`${process.env.BASE_URL}/graphql`, options);
      return promise.then((response) => z.JSON.parse(response.content).data.createTodo);
    },

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 107770,
      body: 'ship latest versio #awesomeproject',
      completed_at: '2019-03-17T10:10:51Z'
    },

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'body', label: 'Body'},
      {key: 'completed_at', label: 'Completed At'}
    ]
  }
}

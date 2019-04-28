const createTodo = (z, bundle) => {
  const query = `
    query ($filter: String) {
      viewer {
        todos(completed: false, filter: $filter) {
          id,
          body,
          created_at
          product {
            id,
            hashtag,
            url,
          }
        }
      }
    }
  `;

  const variables = { filter: bundle.inputData.project };
  const options = {
    method: 'POST',
    body: { query, variables },
  };

  const promise = z.request(`${process.env.BASE_URL}/graphql`, options);
  return promise
    .then(response => z.JSON.parse(response.content).data.viewer.todos)
    .catch(err => z.console.error('err', err));
};

module.exports = {
  key: 'createdTodo',
  noun: 'Created Todo',
  display: {
    label: 'Todo Created',
    description: 'Trigger when a new todo is created.',
  },
  operation: {
    inputFields: [
      {
        key: 'product',
        type: 'string',
        dynamic: 'products.id.hashtag',
        helpText: 'Your product name (hashtag) on WIP',
      },
    ],
    perform: createTodo,
    sample: {
      id: 106613,
      body: 'ship latest version #awesomeproject',
      created_at: '2019-03-08T13:21:32Z',
      product: {
        id: 100,
        hashtag: 'awesomeproject',
        name: 'Awesome Project',
        url: 'https://wip.chat/products/1337',
      },
    },
  },
};

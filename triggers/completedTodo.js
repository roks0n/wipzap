const completeTodo = (z, bundle) => {
  const query = `
    {
      viewer {
        todos(completed: true) {
          id,
          body,
          completed_at
          product {
            id,
            hashtag,
            name,
            url,
          }
        }
      }
    }
  `;
  const options = {
    method: 'POST',
    body: { query: query },
  };

  const promise = z.request(`${process.env.BASE_URL}/graphql`, options);
  return promise
    .then(response => z.JSON.parse(response.content).data.viewer.todos)
    .catch(err => z.console.error('err', err));
};

module.exports = {
  key: 'completedTodo',
  noun: 'Completed Todo',
  display: {
    label: 'Todo Completed',
    description: 'Trigger when a todo is completed.',
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
    perform: completeTodo,
    sample: {
      id: 107576,
      body: 'ship latest version #awesomeproject',
      completed_at: '2019-03-15T18:33:48Z',
      product: {
        id: 100,
        hashtag: 'awesomeproject',
        name: 'Awesome Project',
        url: 'https://wip.chat/products/1337',
      },
    },
  },
};

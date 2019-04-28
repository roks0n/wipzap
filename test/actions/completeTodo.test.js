require('should');

const nock = require('nock');
const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('actions/completeTodo', () => {
  it('mark todos as completed successfully', () => {
    // mock graph requests
    nock(process.env.BASE_URL)
      .post('/graphql')
      .reply(
        200,
        JSON.stringify({
          data: {
            viewer: {
              todos: [
                { id: 106613, body: 'deploy latest version #awesomeapp' },
              ],
            },
          },
        }),
      );

    nock(process.env.BASE_URL)
      .post('/graphql')
      .reply(
        200,
        JSON.stringify({
          data: {
            completeTodo: {
              id: 106613,
              completed_at: '2019-03-15T18:33:48Z',
            },
          },
        }),
      );

    const bundle = {
      authData: {
        access_token: '0123456789',
      },
      inputData: {
        id: 106613,
      },
    };

    return appTester(App.creates.completeTodo.operation.perform, bundle).then(
      result => {
        result.should.be.an.instanceOf(Object);
        result.should.have.property('id', 106613);
        result.should.have.property('completed_at');
      },
    );
  });

  it('should raise an error if more than 2 todos are in results', () => {
    // mock graph request
    nock(process.env.BASE_URL)
      .post('/graphql')
      .reply(
        200,
        JSON.stringify({
          data: {
            viewer: {
              todos: [
                { id: 106613, body: 'deploy latest version #awesomeapp' },
                { id: 106614, body: 'ux research #awesomeapp' },
              ],
            },
          },
        }),
      );

    const bundle = {
      authData: {
        access_token: '0123456789',
      },
      inputData: {
        id: 106613,
      },
    };

    return appTester(App.creates.completeTodo.operation.perform, bundle).catch(
      err => err.message.should.startWith('Expected 1 todo, received 2'),
    );
  });
});

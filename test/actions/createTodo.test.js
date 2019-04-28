require('should');

const nock = require('nock');
const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('actions/createTodo', () => {
  it('create a todo', () => {
    // mock oauth token request
    nock(process.env.BASE_URL)
      .post('/graphql')
      .reply(
        200,
        JSON.stringify({
          data: {
            createTodo: {
              id: 106613,
              body: 'UX research report #awesomeproject',
              completed_at: null,
            },
          },
        }),
      );

    const bundle = {
      authData: {
        access_token: '0123456789',
      },
      inputData: {
        body: 'UX research report',
        project: 'awesomeproject',
      },
    };

    return appTester(App.creates.createTodo.operation.perform, bundle).then(
      result => {
        result.should.have.property('id', 106613);
        result.body.should.eql('UX research report #awesomeproject');
        result.should.have.property('completed_at', null);
      },
    );
  });
});

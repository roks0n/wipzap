require('should');

const nock = require('nock');
const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('triggers/completedTodo', () => {
  it('fetch all completed todos', () => {
    // mock oauth token request
    nock(process.env.BASE_URL)
      .post('/graphql')
      .reply(200, JSON.stringify({
        data: {
          viewer: {
            todos: [
              {
                id: 106613,
                body: 'ship latest version #awesomeproject',
                completed_at: '2019-03-15T18:33:48Z',
                product: {
                  id: 100,
                  hashtag: 'awesomeproject',
                  name: 'Awesome Project',
                  url: 'https://wip.chat/products/1337'
                }
              }
            ]
          }
        }
      }));

    const bundle = {
      authData: {
        access_token: '0123456789'
      }
    };

    return appTester(App.triggers.completedTodo.operation.perform, bundle)
      .then((result) => {
        result.length.should.eql(1);
        result[0].should.be.an.instanceOf(Object);
        result[0].should.have.property('id', 106613);
        result[0].should.have.property('completed_at');
        result[0].product.should.have.property('id', 100);
      });
  });
});

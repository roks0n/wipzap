const fetchProducts = (z, bundle) => {
  const query = `
    query {
      viewer {
        products() {
          id,
          hashtag,
          name,
          url,
        }
      }
    }
  `;

  const options = {
    method: 'POST',
    body: { query },
  };

  const promise = z.request(`${process.env.BASE_URL}/graphql`, options);
  return promise
    .then(response => z.JSON.parse(response.content).data.viewer.products)
    .catch(err => z.console.error('err', err));
};

module.exports = {
  key: 'products',
  noun: 'Products',
  display: {
    label: 'List of Products',
    description:
      'This is a hidden trigger, and is used in a Dynamic Dropdown within this app',
    hidden: true,
  },

  operation: {
    // since this is a 'hidden' trigger, there aren't any inputFields needed
    perform: fetchProducts,
    canPaginate: false,
  },
};

import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          books: {
            merge: false,
          },
        },
      },
    },
  }),
});

const GET_DATA = gql`
  query {
    books {
      title
    }

    # Uncommenting this will fix it?
    # timestamp
  }
`;

const CLEAR_BOOKS = gql`
  mutation {
    clearBooks
  }
`;

function Component() {
  //
  // ISSUE:
  //
  // refetch method will stop updating the cache after the refetchQueries of
  // clearBooks.
  //
  const { data, refetch } = useQuery(GET_DATA);
  const [clearBooks] = useMutation(CLEAR_BOOKS, {
    refetchQueries: [{ query: GET_DATA }],
  });
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <button
        onClick={() => {
          refetch();
        }}
      >
        refetch
      </button>

      <button
        onClick={() => {
          clearBooks();
        }}
      >
        rerefetchQueries
      </button>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div>apollo refetch issue</div>
      <Component />
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.querySelector("#main"));

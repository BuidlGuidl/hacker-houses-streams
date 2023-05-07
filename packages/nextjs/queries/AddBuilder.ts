import { gql } from "urql";

export const BuildersQuery = gql`
  query {
    addBuilders {
      to
    }
  }
`;

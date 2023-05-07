import { gql } from "urql";

export const WithdrawsQuery = gql`
  query {
    withdraws(orderBy: blockTimestamp, orderDirection: desc) {
      reason
      amount
      to
      blockTimestamp
      id
    }
  }
`;

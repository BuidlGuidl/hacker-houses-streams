export default {
  1: [
    {
      name: "mainnet",
      chainId: "1",
      contracts: {
        YourContract: {
          address: "0xaF18f0f1F096FaC34E816C7409348D313ef7c84F",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "AddBuilder",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "UpdateBuilder",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "reason",
                  type: "string",
                },
              ],
              name: "Withdraw",
              type: "event",
            },
            {
              stateMutability: "payable",
              type: "fallback",
            },
            {
              inputs: [
                {
                  internalType: "address[]",
                  name: "_builders",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "_caps",
                  type: "uint256[]",
                },
              ],
              name: "addBatch",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address payable",
                  name: "_builder",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_cap",
                  type: "uint256",
                },
              ],
              name: "addBuilderStream",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address[]",
                  name: "_builders",
                  type: "address[]",
                },
              ],
              name: "allBuildersData",
              outputs: [
                {
                  components: [
                    {
                      internalType: "address",
                      name: "builderAddress",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "cap",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "unlockedAmount",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct YourContract.BuilderData[]",
                  name: "",
                  type: "tuple[]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "frequency",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_amount",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "_reason",
                  type: "string",
                },
              ],
              name: "streamWithdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "streamedBuilders",
              outputs: [
                {
                  internalType: "uint256",
                  name: "cap",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "last",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_builder",
                  type: "address",
                },
              ],
              name: "unlockedBuilderAmount",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address payable",
                  name: "_builder",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_cap",
                  type: "uint256",
                },
              ],
              name: "updateBuilderStreamCap",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
} as const;

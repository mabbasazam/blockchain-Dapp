import { Sepolia } from "@usedapp/core";

const dappConfig = {
  networks: [Sepolia],
  readOnlyChainId: Sepolia.chainId,
  readOnlyUrls: {
    [Sepolia.chainId]: "https://sepolia.infura.io/v3/fe4cbb35f77a406fbbbc0bfdc3b82a82",
  },
  autoConnect: true,
};

export default dappConfig;

export default function getConfig(
  env: string | undefined = process.env.NEXT_PUBLIC_NEAR_ENV
) {
  switch (env) {
    case "pub-testnet":
      return {
        LIQUIDATION_API_URL: "https://public-testnet.liquidation.burrow.fun",
        NODE_URL: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.near.org",
        myNearWalletUrl: "https://app.mynearwallet.com/",
        helperUrl: "https://api.kitwallet.app",
        explorerUrl: "https://nearblocks.io",
        REF_FI_CONTRACT_ID: "ref-finance-101.testnet",
        HISTORY_API_URL: "https://dev.data-service.ref-finance.com",
        LIQUIDATION_RESULT_API_URL: "https://api.ref.finance",
        DASH_BOARD_API_URL: "https://api.flipn.fun",
      };
    case "testnet":
      return {
        LIQUIDATION_API_URL: "https://public-testnet.liquidation.burrow.fun",
        NODE_URL: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        myNearWalletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://testnet-api.kitwallet.app",
        explorerUrl: "https://testnet.nearblocks.io",
        REF_FI_CONTRACT_ID: "exchange.ref-dev.testnet",
        HISTORY_API_URL: "https://dev.data-service.ref-finance.com",
        LIQUIDATION_RESULT_API_URL: "https://api.ref.finance",
        DASH_BOARD_API_URL: "https://api.dumpdump.fun",
      };
    default:
      return {
        LIQUIDATION_API_URL: "https://api.liquidation.burrow.finance",
        NODE_URL: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        myNearWalletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://testnet-api.kitwallet.app",
        explorerUrl: "https://testnet.nearblocks.io",
        REF_FI_CONTRACT_ID: "v2.ref-finance.near",
        HISTORY_API_URL: "https://api.data-service.burrow.finance",
        LIQUIDATION_RESULT_API_URL: "https://api.ref.finance",
        DASH_BOARD_API_URL: "https://api.flipn.fun",
      };
  }
}
export const LP_ASSET_MARK = "shadow_ref_v1";

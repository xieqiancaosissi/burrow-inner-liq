import { keyStores, connect, Contract } from "near-api-js";
import { TokenMetadata, IPool } from "../interface/common";
import getConfig from "../services/config";
const {
  NODE_URL,
  walletUrl,
  myNearWalletUrl,
  helperUrl,
  explorerUrl,
  REF_FI_CONTRACT_ID,
} = getConfig();

// 全局metadata缓存
const globalMetadataCache: { [key: string]: any } = {};

async function connectToNear() {
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  const connectionConfig = {
    networkId: "mainnet",
    keyStore: myKeyStore,
    nodeUrl: `${NODE_URL}`,
    walletUrl: `${walletUrl}`,
    myNearWalletUrl: `${myNearWalletUrl}`,
    helperUrl: `${helperUrl}`,
    explorerUrl: `${explorerUrl}`,
  };
  const nearConnection = await connect(connectionConfig);
  return nearConnection;
}

export async function tokenContract(contractId: string): Promise<any> {
  const nearConnection = await connectToNear();
  const account = await nearConnection.account("");
  let contractSpecial = contractId;
  if (contractId === "aurora") {
    contractSpecial = "eth.bridge.near";
  }
  const contractObj = new Contract(account, contractSpecial, {
    viewMethods: ["ft_metadata"],
    changeMethods: [],
    useLocalViewExecution: false,
  });
  return contractObj;
}
export async function REFContract(contractId: string): Promise<any> {
  const nearConnection = await connectToNear();
  const account = await nearConnection.account("");
  let contractSpecial = contractId;
  if (contractId === "aurora") {
    contractSpecial = "eth.bridge.near";
  }
  const contractObj = new Contract(account, contractSpecial, {
    viewMethods: ["get_pool"],
    changeMethods: [],
    useLocalViewExecution: false,
  });
  return contractObj;
}

export async function ftGetTokenMetadata(id: string): Promise<TokenMetadata> {
  // 检查全局缓存
  if (globalMetadataCache[id]) {
    console.log(
      `Using global cached metadata for ${id}:`,
      globalMetadataCache[id]
    );
    return globalMetadataCache[id];
  }

  if (id === "aurora") {
    id = "eth.bridge.near";
  }

  try {
    const contract = await tokenContract(id);
    const metadata = await contract.ft_metadata({});

    // 缓存成功的metadata
    if (metadata && metadata.decimals !== undefined) {
      globalMetadataCache[id] = metadata;
      console.log(`Cached metadata for ${id}:`, metadata);
    }

    return metadata;
  } catch (error) {
    console.error(`Failed to fetch metadata for ${id}:`, error);
    throw error;
  }
}

export async function get_pool(pool_id: string): Promise<IPool> {
  const contract = await REFContract(REF_FI_CONTRACT_ID);
  const poolDetail = await contract.get_pool({ pool_id: +pool_id });
  return poolDetail;
}

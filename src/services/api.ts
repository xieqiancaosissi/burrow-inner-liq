import { ILiquidation, ILiquidationResponse } from "../interface/common";
import getConfig from "./config";
const config = getConfig();
const {
  LIQUIDATION_API_URL,
  HISTORY_API_URL,
  LIQUIDATION_RESULT_API_URL,
  DASH_BOARD_API_URL,
} = config;
export async function getLiquidations(): Promise<ILiquidationResponse> {
  const defaultResponse: ILiquidationResponse = {
    timestamp: 0,
    data: [],
  };
  try {
    const liquidationsResponse = await fetch(
      `${LIQUIDATION_RESULT_API_URL}/get-liquidation-result?key=LiquidatableAccountViewInfos&contract_id=contract.main.burrow.near`
    );
    const liquidationsData = await liquidationsResponse.json();

    const parsedData = JSON.parse(liquidationsData.data);
    console.log(parsedData,'parsedData')
    return {
      timestamp: parsedData.timestamp,
      data: parsedData.data.values,
    };
  } catch (error) {
    console.error("Error fetching liquidations:", error);
    return defaultResponse;
  }
}
export async function getLiquidationDetail(
  accountId: string,
  position: string
): Promise<ILiquidation[]> {
  const liquidationDetail = await fetch(
    `${LIQUIDATION_API_URL}/liquidation/account/${accountId}/${position}`
  )
    .then((res) => res.json())
    .catch(() => {
      return {};
    });
  try {
    return liquidationDetail.data;
  } catch (error) {
    return [];
  }
}

export async function calcByRepayRatio(
  accountId: string,
  position: string,
  selectedCollateralTokenId: string,
  selectedBorrowedTokenId: string,
  repayRatio: number
): Promise<any> {
  const requestData = {
    accountId: accountId,
    position: position,
    collateralToken: selectedCollateralTokenId,
    borrowedToken: selectedBorrowedTokenId,
    repayRatio: repayRatio,
  };

  try {
    const response = await fetch(
      `${LIQUIDATION_API_URL}/liquidation/calc-by-repay-ratio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return { error };
  }
}

export async function calcByHealthFactor(
  accountId: string,
  position: string,
  selectedCollateralTokenId: string,
  selectedBorrowedTokenId: string,
  repayValue: number,
  targetHealthFactor: number
): Promise<any> {
  const requestData = {
    accountId: accountId,
    position: position,
    collateralToken: selectedCollateralTokenId,
    borrowedToken: selectedBorrowedTokenId,
    repayValue: repayValue,
    targetHealthFactor: targetHealthFactor,
  };

  try {
    const response = await fetch(
      `${LIQUIDATION_API_URL}/liquidation/generate-liquidation-command`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return { error };
  }
}

export async function getHistoryData(
  page_number = 1,
  page_size = 10,
  sort = "timestamp",
  order = "desc",
  liquidation_type = "all"
) {
  const defaultResponse = {
    data: [],
  };
  try {
    const liquidationsResponse = await fetch(
      `${HISTORY_API_URL}/burrow/get_burrow_liquidate_record_page?page_number=${page_number}&page_size=${page_size}&sort=${sort}&order=${order}&liquidation_type=${liquidation_type}`
    );
    const liquidationsData = await liquidationsResponse.json();
    return {
      data: liquidationsData,
    };
  } catch (error) {
    console.error("Error fetching liquidations:", error);
    return defaultResponse;
  }
}

export const getTxId = async (receipt_id: string) => {
  return await fetch(
    `https://api3.nearblocks.io/v1/search/?keyword=${receipt_id}`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getPerice = async () => {
  return await fetch(`https://api.ref.finance/list-token-price`)
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getLiquidationResult = async (key: string) => {
  return await fetch(
    `${LIQUIDATION_RESULT_API_URL}/get-liquidation-result?key=${key}`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getPendingMemeData = async () => {
  try {
    const response = await fetch(
      `${LIQUIDATION_RESULT_API_URL}/get-liquidation-result?key=LiquidatableMarginPositions&contract_id=meme-burrow.ref-labs.near`
    );
    const data = await response.json();
    if (data.code === 0) {
      const values = JSON.parse(data.data.values);
      return values.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching pending meme data:", error);
    return [];
  }
};

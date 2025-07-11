import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Big from "big.js";
import Modal from "react-modal";
import {
  IAsset,
  IAssetsByType,
  ILiquidation,
  IPool,
  ISortkey,
  TokenMetadata,
} from "@/interface/common";
import { getLiquidations } from "@/services/api";
import { LP_ASSET_MARK } from "@/services/config";
import { ftGetTokenMetadata, get_pool } from "@/services/near";
import { BeatLoading } from "../Loading";
import { format_usd } from "@/utils/number";
import { SortIcon } from "../Icons";
import { formatTimestamp } from "@/utils/time";
Modal.defaultStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
    outline: "none",
  },
  content: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -65%)",
    outline: "none",
  },
};
export default function NormalLiquidation(props: any) {
  const router = useRouter();
  const [liquidations, setLiquidations] = useState<ILiquidation[]>([]);
  const [assetsDetail, setAssetsDetail] = useState<IAssetsByType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<ISortkey>("healthFactor");
  const [sortDirection, setSortDirection] = useState("up");
  const [allTokenMetadatas, setAllTokenMetadatas] = useState<
    Record<string, TokenMetadata>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [lpAssets, setLpAssets] = useState<Record<string, any>>({});
  useEffect(() => {
    get_liquidations();
  }, []);
  async function get_liquidations() {
    let liquidations;
    const res = await getLiquidations(
      "LiquidatableAccountViewInfos",
      "contract.main.burrow.near"
    );
    console.log(res, "res");
    liquidations = res.data;
    setTimestamp(res.timestamp);
    const lpAssetIds: any = new Set([]);
    const tokenIdList = liquidations.reduce((acc: any, cur: any) => {
      cur.collateralAssets.forEach((asset: IAsset) => {
        if (asset.tokenId.includes(LP_ASSET_MARK)) {
          lpAssetIds.add(asset.tokenId);
        } else {
          acc.add(asset.tokenId);
        }
      });
      cur.borrowedAssets.forEach((asset: IAsset) => {
        acc.add(asset.tokenId);
      });
      return acc;
    }, new Set());
    const lpAssetIdsArray: string[] = Array.from(lpAssetIds);
    const pool_ids: string[] = [];
    const poolRequests = lpAssetIdsArray.map(async (lpAssetId: string) => {
      const pool_id = lpAssetId.split("-")[1];
      pool_ids.push(pool_id);
      return get_pool(pool_id);
    });
    const pools = await Promise.all(poolRequests);
    const lpAssetsMap = pools.reduce((acc, cur, index) => {
      const pool_id = pool_ids[index];
      return {
        ...acc,
        [LP_ASSET_MARK + "-" + pool_id]: cur.token_account_ids,
      };
    }, {});
    const temp: string[] = [];
    pools.forEach((pool: IPool) => {
      temp.push(...pool.token_account_ids);
    });
    const allTokenIds = Array.from(
      new Set(temp.concat(Array.from(tokenIdList)))
    );
    const requests = allTokenIds.map(async (tokenId) => {
      return ftGetTokenMetadata(tokenId as string);
    });
    const metadatas = await Promise.all(requests);
    const map = metadatas.reduce((acc, metadata, index) => {
      return {
        ...acc,
        [Array.from(allTokenIds)[index] as string]: {
          ...metadata,
          id: Array.from(allTokenIds)[index] as string,
        },
      };
    }, {});
    localStorage.setItem("allTokenMetadatas", JSON.stringify(map));
    localStorage.setItem("lpAssets", JSON.stringify(lpAssetsMap));
    setAllTokenMetadatas(map);
    setLiquidations(liquidations);
    sortInitialLiquidations(liquidations);
    setLpAssets(lpAssetsMap);
    setLoading(false);
  }
  function sortInitialLiquidations(liquidations: ILiquidation[]) {
    const sortedLiquidations = [...liquidations].sort((a, b) => {
      return Big(a.healthFactor).cmp(b.healthFactor);
    });
    setLiquidations(sortedLiquidations);
  }
  function showAssetsModal(
    accountId: string,
    position: string,
    collateralAssets: IAsset[],
    borrowedAssets: IAsset[]
  ) {
    const assetsByType: IAssetsByType = {
      Collateral: {
        type: "Collateral",
        assets: collateralAssets,
      },
      Borrowed: {
        type: "Borrowed",
        assets: borrowedAssets,
      },
      accountId,
      position,
    };
    setIsOpen(true);
    setAssetsDetail(assetsByType);
  }

  function closeAssetsModal() {
    setIsOpen(false);
    setAssetsDetail(null);
  }
  function sortClick(key: ISortkey) {
    const isCurrentlyAscending = sortKey === key && sortDirection === "up";
    const newSortDirection = isCurrentlyAscending ? "down" : "up";

    setSortKey(key);
    setSortDirection(newSortDirection);

    const sortedLiquidations = [...liquidations].sort((a, b) => {
      const valueA = Big(a[key]);
      const valueB = Big(b[key]);
      return newSortDirection === "up"
        ? valueA.sub(valueB).toNumber()
        : valueB.sub(valueA).toNumber();
    });

    setLiquidations(sortedLiquidations);
  }
  function handleDetailsClick(accountId: string, position: string) {
    router.push(
      `/details?accountId=${accountId}&position=${position}&contract_id=contract.main.burrow.near&priceOracleId=priceoracle.near`
    );
  }
  return (
    <div
      className="text-white bg-dark-200 rounded-lg"
      style={{ maxWidth: "76vw", margin: "30px auto 50px auto" }}
    >
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        Pending Liquidation (Total: {liquidations.length})
        <p className="ml-2">
          {timestamp !== null ? formatTimestamp(timestamp) : ""}
        </p>
      </div>
      <div className="overflow-auto w-full" style={{ maxHeight: "84vh" }}>
        <table className="commonTable">
          <thead>
            <tr>
              <th>serial</th>
              <th>accountId</th>
              <th>position</th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("healthFactor");
                  }}
                >
                  healthFactor
                  <SortComponent
                    keyName="healthFactor"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("gapSum");
                  }}
                >
                  gapSum{" "}
                  <SortComponent
                    keyName="gapSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("adjustedGapSum");
                  }}
                >
                  adjustedGapSum{" "}
                  <SortComponent
                    keyName="adjustedGapSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("collateralSum");
                  }}
                >
                  collateralSum{" "}
                  <SortComponent
                    keyName="collateralSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("borrowedSum");
                  }}
                >
                  borrowedSum{" "}
                  <SortComponent
                    keyName="borrowedSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("adjustedCollateralSum");
                  }}
                >
                  adjustedCollateralSum{" "}
                  <SortComponent
                    keyName="adjustedCollateralSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    sortClick("adjustedBorrowedSum");
                  }}
                >
                  adjustedBorrowedSum{" "}
                  <SortComponent
                    keyName="adjustedBorrowedSum"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
              <th>
                <div className="flex justify-center whitespace-nowrap">
                  view details
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {liquidations.map((l, index) => {
              return (
                <tr key={l.accountId} className="hover:bg-dark-250">
                  <td className="h-16">
                    <span className="pl-2">{index + 1}</span>
                  </td>
                  <td title={l.accountId}>
                    <div className="justify-self-start overflow-hidden w-32 whitespace-nowrap text-ellipsis">
                      {l.accountId}
                    </div>
                  </td>
                  <td>{l.position}</td>
                  <td>{l.healthFactor}%</td>
                  <td title={l.gapSum}>{format_usd(l.gapSum)}</td>
                  <td title={l.adjustedGapSum}>
                    {format_usd(l.adjustedGapSum)}
                  </td>
                  <td title={l.collateralSum}>{format_usd(l.collateralSum)}</td>
                  <td title={l.borrowedSum}>{format_usd(l.borrowedSum)}</td>
                  <td title={l.adjustedCollateralSum}>
                    {format_usd(l.adjustedCollateralSum)}
                  </td>
                  <td title={l.adjustedBorrowedSum}>
                    {format_usd(l.adjustedBorrowedSum)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center px-3 h-8 cursor-pointer whitespace-nowrap underline"
                        onClick={() => {
                          handleDetailsClick(l.accountId, l.position);
                        }}
                      >
                        Details
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading ? <BeatLoading /> : null}
        {!loading && !liquidations.length ? (
          <div className="flex items-center justify-center text-base text-dark-300 my-20">
            fetch data error...
          </div>
        ) : null}
      </div>
      {/* {assetsDetail && (
        <AssetModal
          isOpen={isOpen}
          onRequestClose={closeAssetsModal}
          assets={assetsDetail}
          allTokenMetadatas={allTokenMetadatas}
          accountId={assetsDetail.accountId}
          position={assetsDetail.position}
        />
      )} */}
    </div>
  );
}

function SortComponent(props: any) {
  const { sortKey, sortDirection, keyName } = props;
  if (keyName !== sortKey) {
    return <SortIcon className="text-white text-opacity-30" />;
  } else if (sortDirection === "up") {
    return <SortIcon className="text-white transform rotate-180" />;
  } else {
    return <SortIcon className="text-white" />;
  }
}

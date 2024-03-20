import { useReadContract, useAccount } from "wagmi";
import { ReadContractErrorType } from "wagmi/actions";
import { formatEther } from "viem";
import { address, abi } from "@/contracts/MainToken.json";
import { memo } from "react";

const TokenStatus = async () => {
  const userAccount = useAccount();
  const {
    data: balance,
    error,
    isPending,
  } = useReadContract({
    address: `0x${address}`,
    abi,
    functionName: "balanceOf",
    args: [userAccount.address],
  });

  if (isPending) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        Error: {(error as ReadContractErrorType).shortMessage || error.message}
      </div>
    );

  return (
    <>
      <div className="flex">
        Token Balance:&nbsp;
        <b>{formatEther(balance?.toString() as unknown as bigint)}&nbsp;MT</b>
        {/* <div className="relative">
          <Badge content="MT" color="primary">
            ""
          </Badge>
        </div> */}
      </div>
    </>
  );
};

export default memo(TokenStatus);

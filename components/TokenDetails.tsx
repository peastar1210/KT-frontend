import { memo } from "react";
import { Link } from "@nextui-org/react";
import { useReadContract, useAccount } from "wagmi";
import { ReadContractErrorType } from "wagmi/actions";

import { address, abi } from "@/contracts/MainToken.json";

const TokenDetails = async () => {
  const {
    data: tokenName,
    error,
    isPending,
  } = useReadContract({
    address: `0x${address}`,
    abi,
    functionName: "name",
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
        <b>{tokenName?.toString()}&nbsp;:&nbsp;</b>
        <Link
          target="_blank"
          href={`https://mumbai.polygonscan.com/address/0x${address}`}
        >
          0x{address}
        </Link>
      </div>
    </>
  );
};

export default memo(TokenDetails);

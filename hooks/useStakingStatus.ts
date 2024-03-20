import { useReadContracts, useAccount } from "wagmi";
import { formatEther } from "viem";
import { abi, address } from "@/contracts/StakingRewards.json";

const useStakingStatus = () => {
  const userAccount = useAccount();
  const { address: userAddress } = userAccount;
  const { data, isPending } = useReadContracts({
    contracts: [
      {
        address: `0x${address}`,
        abi: abi,
        functionName: "totalSupply",
      },
      {
        address: `0x${address}`,
        abi: abi,
        functionName: "balanceOf",
        args: [userAddress],
      },
    ],
  });

  let total: number = 0,
    stake: number = 0;

  if (isPending) return { total, stake };

  const [totalSupply, stakedAmount] = data || [];

  if (totalSupply?.status === "success") {
    total = parseInt(formatEther(totalSupply.result as bigint));
  }
  if (stakedAmount?.status === "success") {
    stake = parseInt(formatEther(stakedAmount.result as bigint));
  }

  return { total, stake };
};

export default useStakingStatus;

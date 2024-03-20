import { useReadContracts } from "wagmi";
import { abi, address } from "@/contracts/JobBoard.json";

const useJobBoardStatus = () => {
  const { data, isPending } = useReadContracts({
    contracts: [
      {
        address: `0x${address}`,
        abi: abi,
        functionName: "tokenAmountForPosting",
      },
      {
        address: `0x${address}`,
        abi: abi,
        functionName: "tokenAmountForApplying",
      },
    ],
  });

  if (isPending) return { tokenForPosting: "", tokenForApplying: "" };

  const [tokenAmountForPosting, tokenAmountForApplying] = data || [];

  let tokenForPosting = tokenAmountForPosting?.result;
  let tokenForApplying = tokenAmountForApplying?.result;

  return { tokenForPosting, tokenForApplying };
};

export default useJobBoardStatus;

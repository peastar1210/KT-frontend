"use client";

import Navbar from "@/components/Navbar";
import { Button, Input, Chip } from "@nextui-org/react";
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";
import { showToast } from "@/helper/ToastNotify";
import useStakingStatus from "@/hooks/useStakingStatus";
import { abi as MTABI, address as MTAddress } from "@/contracts/MainToken.json";
import {
  abi as stakingABI,
  address as stakingAddress,
} from "@/contracts/StakingRewards.json";
import { parseEther } from "viem";

export default function Stake() {
  const userAccount = useAccount();
  const { total, stake } = useStakingStatus();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const {
    data: hashStaking,
    isPending: isPendingStaking,
    error: errorStaking,
    writeContractAsync: writeContractAsyncStaking,
  } = useWriteContract();

  const {
    isLoading: isConfirmingStaking,
    isSuccess: isConfirmedStaking,
    isError: isFailedStaking,
  } = useWaitForTransactionReceipt({
    hash: hashStaking,
  });
  const {
    data: hashStakingTX,
    isPending: isPendingStakingTX,
    error: errorStakingTX,
    writeContractAsync: writeContractAsyncStakingTX,
  } = useWriteContract();

  const {
    isLoading: isConfirmingStakingTX,
    isSuccess: isConfirmedStakingTX,
    isError: isFailedStakingTX,
  } = useWaitForTransactionReceipt({
    hash: hashStakingTX,
  });

  const writeStaking = async () => {
    try {
      const tx = await writeContractAsyncStakingTX({
        abi: stakingABI,
        address: `0x${stakingAddress}`,
        functionName: "stake",
        args: [parseEther(tokenAmount)],
      });
      console.log("tx1:", tx);
      setTokenAmount("");
    } catch (err) {
      console.log("err:", err);
      setTokenAmount("");

      showToast("error", "Transaction reverted");
      return;
    }
  };

  useEffect(() => {
    if (isConfirmedStaking) writeStaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedStaking]);

  useEffect(() => {
    if (isConfirmedStaking) {
      showToast("success", "Transaction Confirmed.");
    }
    if (isFailedStaking) {
      showToast("error", "Transaction error.");
    }
    if (isConfirmedStakingTX) {
      showToast("success", "Token staked successfully.");
    }
    if (isFailedStakingTX) {
      showToast("error", "Token stake error.");
    }
  }, [
    isConfirmedStaking,
    isFailedStaking,
    isFailedStakingTX,
    isConfirmedStakingTX,
  ]);

  const {
    data: hashWithdraw,
    isPending: isPendingWithdraw,
    error: errorWithdraw,
    writeContractAsync: writeContractAsyncWithdraw,
  } = useWriteContract();

  const {
    isLoading: isConfirmingWithdraw,
    isSuccess: isConfirmedWithdraw,
    isError: isFailedWithdraw,
  } = useWaitForTransactionReceipt({
    hash: hashWithdraw,
  });

  const _stake = async () => {
    try {
      const tx = await writeContractAsyncStaking({
        abi: MTABI,
        address: `0x${MTAddress}`,
        functionName: "approve",
        args: [`0x${stakingAddress}`, parseEther(tokenAmount)],
      });
      console.log("tx1:", tx);
    } catch (err) {
      console.log("err:", err);
      showToast("error", "Transaction reverted");
      return;
    }
  };

  useEffect(() => {
    if (isConfirmedWithdraw) {
      showToast("success", "withdraw successfully");
    }
  }, [isConfirmedWithdraw]);

  const _widthdraw = async () => {
    try {
      const tx = await writeContractAsyncWithdraw({
        abi: stakingABI,
        address: `0x${stakingAddress}`,
        functionName: "withdraw",
        args: [parseEther(withdrawAmount)],
      });
      console.log("tx1:", tx);
      showToast("info", "Transaction confirming now.");
      setWithdrawAmount("");
    } catch (err) {
      console.log("err:", err);
      setWithdrawAmount("");
      showToast("error", "Transaction reverted");
      return;
    }
  };

  const {
    data: hashReward,
    isPending: isPendingReward,
    error: errorReward,
    writeContractAsync: writeContractAsyncReward,
  } = useWriteContract();

  const {
    isLoading: isConfirmingReward,
    isSuccess: isConfirmedReward,
    isError: isFailedReward,
  } = useWaitForTransactionReceipt({
    hash: hashReward,
  });

  const _reward = async () => {
    try {
      const tx = await writeContractAsyncReward({
        abi: stakingABI,
        address: `0x${stakingAddress}`,
        functionName: "getReward",
      });
      console.log("tx1:", tx);
    } catch (err) {
      console.log("err:", err);
      showToast("error", "Transaction reverted");
      return;
    }
  };

  useEffect(() => {
    if (isConfirmedReward)
      showToast("success", "Congratulations! You have been rewarded.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedWithdraw]);

  return (
    <div className="relative flex flex-col items-center h-screen">
      <Navbar />
      <div className="h-full w-full flex bg-white flex-grow items-center justify-center px-20 sm:px-20 md:px-10 lg:px-10 xl:px-24 pt-40 pb-10 shadow-md">
        <div className="h-full flex flex-col bg-white w-full max-w-[760px] mb-6">
          <div className="relative h-full flex flex-col gap-10 justify-center items-center p-8 border-1 border-gray-100 shadow-xl rounded-xl">
            <div className="text-4xl font-bold text-blue-500 drop-shadow-xl">
              Staking
            </div>
            <div className="w-2/3 flex flex-col gap-8">
              <div className=" bg-yellow-50 border-1 border-yellow-100 flex flex-col shadow-lg rounded-2xl px-16 py-8 gap-4">
                <div className="grid grid-cols-12">
                  <div className="col-span-4">Total Staked:</div>
                  <div className="col-span-8 grid justify-center">
                    <Chip variant="bordered" color="primary">
                      {total}
                    </Chip>
                  </div>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-4">My Staking:</div>
                  <div className="col-span-8 grid justify-center">
                    <Chip variant="bordered" color="success">
                      {stake}
                    </Chip>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <Input
                  className="col-span-8"
                  type="text"
                  color="primary"
                  variant="flat"
                  value={tokenAmount}
                  onChange={(event) => setTokenAmount(event.target.value)}
                />
                <Button
                  className="col-span-4"
                  color="primary"
                  variant="light"
                  onClick={_stake}
                  isLoading={isPendingStaking}
                >
                  Stake
                </Button>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <Input
                  className="col-span-8"
                  type="text"
                  color="danger"
                  variant="flat"
                  value={withdrawAmount}
                  onChange={(event) => setWithdrawAmount(event.target.value)}
                />

                <Button
                  className="col-span-4"
                  color="danger"
                  variant="light"
                  isLoading={isPendingWithdraw}
                  onClick={_widthdraw}
                >
                  Withdraw
                </Button>
              </div>
              <Button
                color="success"
                variant="light"
                isLoading={isPendingReward}
                onClick={_reward}
              >
                Get Reward
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

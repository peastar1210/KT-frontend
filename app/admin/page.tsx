"use client";

import { useState, useEffect } from "react";
import { Button, Input, Chip } from "@nextui-org/react";
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

import Navbar from "@/components/Navbar";
import { showToast } from "@/helper/ToastNotify";
import useStakingStatus from "@/hooks/useStakingStatus";
import {
  abi as RTABI,
  address as RTAddress,
} from "@/contracts/RewardToken.json";
import {
  abi as stakingABI,
  address as stakingAddress,
} from "@/contracts/StakingRewards.json";

export default function Admin() {
  const userAccount = useAccount();
  const { total, stake } = useStakingStatus();
  const { address, isConnected } = userAccount;
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [duration, setduration] = useState<string>("");
  const [rewardAmount, setRewardAmount] = useState<string>("");

  const {
    data: hashDuration,
    isPending: isPendingDuration,
    error: errorDuration,
    writeContractAsync: writeContractAsyncDuration,
  } = useWriteContract();

  const {
    isLoading: isConfirmingDuration,
    isSuccess: isConfirmedDuration,
    isError: isFailedDuration,
  } = useWaitForTransactionReceipt({
    hash: hashDuration,
  });
  const {
    data: hashTransfer,
    isPending: isPendingTransfer,
    error: errorTransfer,
    writeContractAsync: writeContractAsyncTransfer,
  } = useWriteContract();

  const {
    isLoading: isConfirmingTransfer,
    isSuccess: isConfirmedTransfer,
    isError: isFailedTransfer,
  } = useWaitForTransactionReceipt({
    hash: hashTransfer,
  });

  const _transfer = async () => {
    try {
      const tx = await writeContractAsyncTransfer({
        abi: RTABI,
        address: `0x${RTAddress}`,
        functionName: "transfer",
        args: [`0x${stakingAddress}`, parseEther(tokenAmount)],
      });
      console.log("tx1:", tx);
      setTokenAmount("");
    } catch (err) {
      console.log("err:", err);
      showToast("error", "Transaction reverted");
      setTokenAmount("");
      return;
    }
  };
  useEffect(() => {
    if (isConfirmedTransfer) {
      showToast("success", "Token transfered successfully.");
    }
    if (isFailedTransfer) {
      showToast("error", "Token transfer error.");
    }
  }, [isConfirmedTransfer, isFailedTransfer]);

  useEffect(() => {
    if (isConfirmedDuration) {
      showToast("success", "Transaction Confirmed.");
    }
    if (isFailedDuration) {
      showToast("error", "Transaction error.");
    }
  }, [isConfirmedDuration, isFailedDuration]);

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

  const _setDuration = async () => {
    try {
      const tx = await writeContractAsyncDuration({
        abi: stakingABI,
        address: `0x${stakingAddress}`,
        functionName: "setRewardsDuration",
        args: [duration],
      });
      console.log("tx1:", tx);
      setduration("");
    } catch (err) {
      setduration("");
      console.log("err:", err);
      showToast("error", "Transaction reverted");
      return;
    }
  };

  useEffect(() => {
    if (isConfirmedWithdraw) showToast("success", "withdraw successfully");
  }, [isConfirmedWithdraw]);

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

  const _notifyReward = async () => {
    try {
      const tx = await writeContractAsyncReward({
        abi: stakingABI,
        address: `0x${stakingAddress}`,
        functionName: "notifyRewardAmount",
        args: [parseEther(rewardAmount)],
      });
      setRewardAmount("");
    } catch (err) {
      setRewardAmount("");
      console.log("err:", err);
      showToast("error", "Transaction reverted");
      return;
    }
  };

  useEffect(() => {
    if (isConfirmedReward) showToast("success", "Congratulations! reward set.");
  }, [isConfirmedReward]);

  return (
    <div className="relative flex flex-col items-center h-screen">
      <Navbar />
      <div className="h-full w-full flex bg-white flex-grow items-center justify-center px-20 sm:px-20 md:px-10 lg:px-10 xl:px-24 pt-40 pb-10 shadow-md">
        <div className="h-full flex flex-col bg-white w-full max-w-[760px] mb-6">
          <div className="relative h-full flex flex-col gap-10 justify-center items-center p-8 border-1 border-gray-100 shadow-xl rounded-xl">
            <div className="text-4xl font-bold text-red-400 drop-shadow-xl">
              Staking Admin
            </div>
            <div className="w-2/3 flex flex-col gap-8">
              <div className=" bg-slate-100 shadow-lg rounded-lg px-16 py-8 flex flex-col gap-4">
                <div className="grid grid-cols-12">
                  <div className="col-span-4">Total Staked:</div>
                  <div className="col-span-8 grid justify-center">
                    <Chip color="primary" variant="bordered">
                      {total}
                    </Chip>
                  </div>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-4">My Staking:</div>
                  <div className="col-span-8 grid justify-center">
                    <Chip color="secondary" variant="bordered">
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
                  onClick={_transfer}
                  isLoading={isPendingTransfer}
                >
                  Transfer
                </Button>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <Input
                  className="col-span-8"
                  type="text"
                  color="danger"
                  variant="flat"
                  value={duration}
                  onChange={(event) => setduration(event.target.value)}
                />

                <Button
                  className="col-span-4"
                  color="danger"
                  variant="light"
                  isLoading={isPendingDuration}
                  onClick={_setDuration}
                >
                  SetDuration
                </Button>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <Input
                  className="col-span-8"
                  type="text"
                  color="success"
                  variant="flat"
                  value={rewardAmount}
                  onChange={(event) => setRewardAmount(event.target.value)}
                />
                <Button
                  className="col-span-4"
                  color="success"
                  variant="light"
                  isLoading={isPendingReward}
                  onClick={_notifyReward}
                >
                  NotifyReward
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

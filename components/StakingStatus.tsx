import { type BaseError, useReadContracts, useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { abi, address } from '@/contracts/StakingRewards.json'
import { user } from '@nextui-org/theme'

const StakingStatus = () => {
  const userAccount = useAccount()
  const { address: userAddress } = userAccount
  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        address: `0x${address}`,
        abi: abi,
        functionName: 'totalSupply',
      },
      {
        address: `0x${address}`,
        abi: abi,
        functionName: 'balanceOf',
        args: [userAddress],
      },
    ],
  })

  if (isPending) return 0

  const [totalSupply, stakedAmount] = data || []

  let total = formatEther(totalSupply?.result || 0)
  let stake = formatEther(stakedAmount?.result || 0)

  return { total, stake }
}

export default StakingStatus

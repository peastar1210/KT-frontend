import { type BaseError, useReadContracts, useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { abi, address } from '@/contracts/JobBoard.json'
import { user } from '@nextui-org/theme'

const JobBoardStatus = () => {
  const userAccount = useAccount()
  const { address: userAddress } = userAccount
  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        address: `0x${address}`,
        abi: abi,
        functionName: 'tokenAmountForPosting',
      },
      {
        address: `0x${address}`,
        abi: abi,
        functionName: 'tokenAmountForApplying',
      },
    ],
  })

  if (isPending) return 0

  const [tokenAmountForPosting, tokenAmountForApplying] = data || []

  let tokenForPosting = tokenAmountForPosting?.result
  let tokenForApplying = tokenAmountForApplying?.result

  return { tokenForPosting, tokenForApplying }
}

export default JobBoardStatus

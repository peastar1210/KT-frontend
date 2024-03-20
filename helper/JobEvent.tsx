import { useWatchContractEvent } from 'wagmi'
import { abi, address } from '@/contracts/JobBoard.json'
import { showToast } from '@/helper/ToastNotify'

export default function JobEvent() {
  useWatchContractEvent({
    address: `0x${address}`,
    abi: abi,
    eventName: 'JobPosted',
    onLogs(logs) {
      console.log('New Job!', logs)
      showToast('info', 'New Job Posted! Please apply that job!')
    },
  })
}

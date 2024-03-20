import { type BaseError, useReadContract } from 'wagmi'
import { address, abi } from '@/contracts/JobBoard.json'
import { Accordion, AccordionItem } from '@nextui-org/react'
import { FaMapLocation, FaDollarSign } from 'react-icons/fa6'

const ApplicationList = ({ jobId }) => {
  const {
    data: AppList,
    error,
    isPending,
  } = useReadContract({
    abi: abi,
    address: `0x${address}`,
    functionName: 'getApplications',
    args: [jobId],
  })

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>Error: {(error as BaseError).shortMessage || error.message}</div>
    )

  console.log('AppList:', AppList)

  return (
    <>
      <Accordion variant="splitted">
        {AppList.map((Application) => (
          <AccordionItem
            key={Application.candidate}
            aria-label={Application.candidate}
            title={Application.candidate}
            subtitle={
              <span className="flex items-center gap-8">
                <span className="flex items-center gap-2">
                  <FaMapLocation /> Location:
                  <strong>{Application.location}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <FaDollarSign /> Salary:
                  <strong>Hourly ${Number(Application.salary)}</strong>
                </span>
              </span>
            }
          >
            {Application.application}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}

export default ApplicationList

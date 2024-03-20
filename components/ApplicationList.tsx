import { type BaseError, useReadContract } from "wagmi";
import { address, abi } from "@/contracts/JobBoard.json";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { FaMapLocation, FaDollarSign } from "react-icons/fa6";
import { ReadContractData } from "wagmi/query";

const ApplicationList = ({ jobId }: { jobId: any }) => {
  const {
    data: appList,
    error,
    isPending,
  } = useReadContract({
    abi: abi,
    address: `0x${address}`,
    functionName: "getApplications",
    args: [jobId],
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  console.log("appList:", appList);

  return (
    <>
      <Accordion variant="splitted">
        {(appList as any[]).map((app) => (
          <AccordionItem
            key={app.candidate}
            aria-label={app.candidate}
            title={app.candidate}
            subtitle={
              <span className="flex items-center gap-8">
                <span className="flex items-center gap-2">
                  <FaMapLocation /> Location:
                  <strong>{app.location}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <FaDollarSign /> Salary:
                  <strong>Hourly ${Number(app.salary)}</strong>
                </span>
              </span>
            }
          >
            {app.application}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default ApplicationList;

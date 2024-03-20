import { Image, Chip, Badge } from "@nextui-org/react";
import { FaCheck, FaBolt, FaMap, FaPaypal } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import { useAccount } from "wagmi";

type JobCardProps = {
  currentJob: JobType;
  setSelectedJob: Function;
  className: string;
};

const JobCard: React.FC<JobCardProps> = ({
  currentJob,
  setSelectedJob,
  className,
}) => {
  const getTime = () => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const postedTimeFromNow =
      currentTimeInSeconds - Number(currentJob.timestamp);
    if (postedTimeFromNow < 3600) return "Just Now";
    else if (postedTimeFromNow < 3600 * 24)
      return Math.floor(postedTimeFromNow / 3600) + " hours ago";
    else if (postedTimeFromNow < 3600 * 24 * 30)
      return Math.floor(postedTimeFromNow / (3600 * 24)) + " days ago";
    else if (postedTimeFromNow < 3600 * 24 * 30 * 12)
      return Math.floor(postedTimeFromNow / (3600 * 24 * 30)) + " months ago";
    else
      return (
        Math.floor(postedTimeFromNow / (3600 * 24 * 30 * 12)) + " years ago"
      );
  };

  const userAccount = useAccount();

  const { address, isConnected } = userAccount;

  return (
    <>
      <div className={className} onClick={() => setSelectedJob(currentJob)}>
        <div className="flex items-center p-4 w-full">
          <div className="flex flex-col w-full gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">{currentJob.title}</h3>
              {currentJob.employer == address && (
                <Chip
                  startContent={<FaCheck size={12} />}
                  variant="flat"
                  color="secondary"
                >
                  My JOB
                </Chip>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <FaMap size={14} />
                <p className="text-sm">{currentJob.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaPaypal size={14} />
                <p className="text-sm">{`Hourly $${currentJob.salaryFrom} - $${currentJob.salaryTo} `}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentJob.applied ? (
                <Chip
                  startContent={<FaCheck size={12} />}
                  variant="flat"
                  color="secondary"
                >
                  Applied
                </Chip>
              ) : (
                <Chip
                  startContent={<FaBolt size={12} />}
                  variant="flat"
                  color="primary"
                >
                  Quick Apply
                </Chip>
              )}
              <Chip
                startContent={<FaComment size={12} />}
                variant="flat"
                color="primary"
              >
                {Number(currentJob.applicationCount) > 0
                  ? Number(currentJob.applicationCount) + " applications"
                  : "First Candiate!"}
              </Chip>
            </div>
            <p className="text-sm">{`Posted ${getTime()}`}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobCard;

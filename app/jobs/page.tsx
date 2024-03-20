"use client";

import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import { FaEye, FaMapMarkerAlt } from "react-icons/fa";
import { FaDesktop } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaMap } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";

import {
  abi as jobContractABI,
  address as jobContractAddress,
} from "@/contracts/JobBoard.json";
import { abi as MTABI, address as MTAddress } from "@/contracts/MainToken.json";

import { showToast } from "@/helper/ToastNotify";
import { FaBolt } from "react-icons/fa6";

import useJobList from "@/hooks/useJobList";
import JobEvent from "@/helper/JobEvent";
import useStakingStatus from "@/hooks/useStakingStatus";
import useJobBoardStatus from "@/hooks/useJobBoardStatus";
import ApplicationList from "@/components/ApplicationList";

export default function Jobs() {
  const userAccount = useAccount();

  const { stake } = useStakingStatus();
  const { tokenForPosting, tokenForApplying } = useJobBoardStatus();

  const [application, setApplication] = useState<string>("");
  const [salaryApply, setSalaryApply] = useState<number>(0);
  const [locationApply, setLocationApply] = useState<string>("");

  const {
    data: hashPosting,
    isPending: isPendingPosting,
    writeContractAsync: writeContractAsyncPosting,
  } = useWriteContract();

  const {
    data: hashPostingTX,
    // isPending: isPendingPostingTX,
    writeContractAsync: writeContractAsyncPostingTX,
  } = useWriteContract();
  const {
    data: hashApplying,
    isPending: isPendingApplying,
    writeContractAsync: writeContractAsyncApplying,
  } = useWriteContract();

  const {
    data: hashApplyingTX,
    // isPending: isPendingApplyingTX,
    writeContractAsync: writeContractAsyncApplyingTX,
  } = useWriteContract();

  const { jobList: jobs } = useJobList();

  const {
    // isLoading: isConfirmingPosting,
    isSuccess: isConfirmedPosting,
    isError: isFailedPosting,
  } = useWaitForTransactionReceipt({
    hash: hashPosting,
  });

  const {
    // isLoading: isConfirmingPostingTX,
    isSuccess: isConfirmedPostingTX,
    isError: isFailedPostingTX,
  } = useWaitForTransactionReceipt({
    hash: hashPostingTX,
  });
  const {
    // isLoading: isConfirmingApplying,
    isSuccess: isConfirmedApplying,
    isError: isFailedApplying,
  } = useWaitForTransactionReceipt({
    hash: hashApplying,
  });

  const {
    // isLoading: isConfirmingApplyingTX,
    isSuccess: isConfirmedApplyingTX,
    isError: isFailedApplyingTX,
  } = useWaitForTransactionReceipt({
    hash: hashApplyingTX,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isListOpen,
    onOpen: onListOpen,
    onClose: onListClose,
  } = useDisclosure();
  const {
    isOpen: isAppOpen,
    onOpen: onAppOpen,
    onClose: onAppClose,
  } = useDisclosure();

  const [selectedJob, setSelectedJob] = useState<JobType>({
    employer: "",
    id: "",
    title: "",
    description: "",
    qualifications: "",
    location: "",
    salaryFrom: 0,
    salaryTo: 0,
    siteURL: "",
    applied: false,
    timestamp: 0,
    applicationCount: 0,
  });
  const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
  const [newJob, setNewJob] = useState<JobType>({
    employer: "",
    id: "",
    title: "",
    location: "",
    salaryFrom: 0,
    salaryTo: 0,
    qualifications: "",
    description: "",
    siteURL: "",
    applied: false,
    timestamp: 0,
    applicationCount: 0,
  });

  useEffect(() => {
    console.log("job selected");
    setIsOnSearch(false);
  }, [selectedJob]);

  useEffect(() => {
    if (jobs !== undefined) {
      console.log("JOB !===========HERE");
      console.log(jobs);
      if (selectedJob.id !== "") console.log("Job selected!");
      else setSelectedJob(jobs[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewJob({ ...newJob, [event.target.name]: event.target.value });
  };
  const postJob = () => {
    if (stake > 0) onOpen();
    else {
      showToast("error", "You need to stake first");
      return;
    }
  };

  const _postJob = async () => {
    try {
      const tx = await writeContractAsyncPosting({
        abi: MTABI,
        address: `0x${MTAddress}`,
        functionName: "approve",
        args: [`0x${jobContractAddress}`, tokenForPosting],
      });
      console.log("tx1:", tx);
      showToast("info", "Transaction confirming now.");
    } catch (err) {
      console.log("err:", err);
      showToast("error", "Transaction reverted");
      return;
    }
    onClose();
  };

  const writePostJob = async () => {
    console.log("confirmed and execute");
    try {
      const tx = await writeContractAsyncPostingTX({
        abi: jobContractABI,
        address: `0x${jobContractAddress}`,
        functionName: "postJob",
        args: [
          newJob.title,
          newJob.description,
          newJob.qualifications,
          newJob.location,
          newJob.salaryFrom,
          newJob.salaryTo,
          newJob.siteURL,
        ],
      });
      console.log("tx:", tx);
      // showToast('info', 'Job Posted Successfully!')
    } catch (err) {
      console.log(err);
      showToast("error", "Transaction failed");
    }
  };
  useEffect(() => {
    if (isConfirmedPosting) writePostJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedPosting]);

  const writeApplyingJob = async () => {
    console.log("confirmed and execute");
    try {
      const tx = await writeContractAsyncApplyingTX({
        abi: jobContractABI,
        address: `0x${jobContractAddress}`,
        functionName: "applyForJob",
        args: [selectedJob.id, application, locationApply, salaryApply],
      });
      console.log("tx:", tx);
      // showToast('info', 'Applied for Job!')
    } catch (err) {
      console.log(err);
      showToast("error", "Transaction failed");
    }
  };
  useEffect(() => {
    if (isConfirmedApplying) writeApplyingJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedApplying]);

  const applyJob = () => {
    if (stake > 0) onAppOpen();
    else {
      showToast("error", "You need to stake first");
      return;
    }
  };

  const _applyJob = async () => {
    console.log(selectedJob);
    try {
      const tx = await writeContractAsyncApplying({
        abi: MTABI,
        address: `0x${MTAddress}`,
        functionName: "approve",
        args: [`0x${jobContractAddress}`, tokenForApplying],
      });
      console.log("tx1:", tx);
      showToast("info", "Transaction confirming now.");
    } catch (err) {
      console.log("err:", err);
      showToast("error", "Transaction reverted");
      return;
    }
    onAppClose();
  };

  JobEvent();

  useEffect(() => {
    if (isConfirmedApplying) {
      showToast("success", "Transaction Confirmed.");
    }
    if (isFailedApplying) {
      showToast("error", "Transaction error.");
    }
    if (isConfirmedApplyingTX) {
      showToast("success", "Job Applied Successfully.");
    }
    if (isFailedApplyingTX) {
      showToast("error", "Job Applying Error.");
    }
  }, [
    isConfirmedApplying,
    isFailedApplying,
    isFailedApplyingTX,
    isConfirmedApplyingTX,
  ]);

  useEffect(() => {
    if (isConfirmedPosting) {
      showToast("success", "Transaction Confirmed.");
    }
    if (isFailedPosting) {
      showToast("error", "Transaction error.");
    }
    if (isConfirmedPostingTX) {
      showToast("success", "Job Posted successfully.");
    }
    if (isFailedPostingTX) {
      showToast("error", "Job Posting error.");
    }
  }, [
    isConfirmedPosting,
    isFailedPosting,
    isFailedPostingTX,
    isConfirmedPostingTX,
  ]);

  return (
    <div className="relative flex flex-col items-center h-screen">
      <Navbar />
      <div className="h-full w-full flex bg-white flex-grow items-center justify-center px-20 sm:px-20 md:px-10 lg:px-10 xl:px-24 pt-36 shadow-md">
        <div className="h-full flex flex-col bg-white w-full max-w-[1360px] mb-12">
          <div className="relative flex justify-between items-center pb-4">
            <div className="md:hidden">
              <Button isIconOnly color="primary" aria-label="Like">
                <FaSearch className="text-xl text-white pointer-events-none flex-shrink-0" />
              </Button>
            </div>
            <div className="gap-3 hidden md:flex transition-all">
              <Input
                type="text"
                placeholder="Job"
                labelPlacement="outside"
                startContent={
                  <FaDesktop className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
              <Input
                type="text"
                placeholder="Remote"
                labelPlacement="outside"
                startContent={
                  <FaMapMarkerAlt className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
              <Button
                color="primary"
                variant="bordered"
                startContent={
                  <FaSearch className="text-xl text-primary pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <div>
              <Button color="primary" variant="shadow" onClick={postJob}>
                Post Job
              </Button>
            </div>
          </div>
          <div className="relative h-[calc(100%-46px)] flex-none">
            <div className="relative grid grid-cols-12 gap-5 h-full w-full">
              <div
                className={
                  isOnSearch
                    ? "h-full col-span-12 overflow-y-auto md:block gap-3 md:col-span-6 lg:col-span-4 p-5 rounded-xl shadow-xl border-gray-200 border-solid border-1"
                    : "h-full col-span-12 hidden overflow-y-auto md:block gap-3 md:col-span-6 lg:col-span-4 p-5 rounded-xl shadow-xl border-gray-200 border-solid border-1"
                }
              >
                {jobs &&
                  jobs.map((job: JobType) => (
                    <JobCard
                      currentJob={job}
                      setSelectedJob={setSelectedJob}
                      className={
                        selectedJob !== undefined && selectedJob.id === job.id
                          ? "bg-gray-50 border-2 mt-3 w-full border-blue-500 rounded-lg hover:shadow-md cursor-pointer hover:bg-gray-100"
                          : "bg-gray-50 border-2 mt-3 w-full border-gray-100 rounded-lg hover:shadow-md cursor-pointer hover:bg-gray-100"
                      }
                      key={job.id}
                    />
                  ))}
              </div>
              <Card
                className={
                  isOnSearch
                    ? "relative w-full h-full hidden md:grid col-span-12 overflow-y-auto lg:col-span-8 md:col-span-6"
                    : "relative w-full h-full grid md:grid col-span-12 overflow-y-auto lg:col-span-8 md:col-span-6"
                }
              >
                <CardHeader className="gap-3 justify-between">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      {selectedJob && (
                        <p className="text-lg">{selectedJob.title}</p>
                      )}
                      {selectedJob && (
                        <div className="text-small text-default-500 flex items-center gap-2">
                          <FaMap />
                          {`${selectedJob.location}`}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    color="danger"
                    className="md:hidden px-8"
                    variant="light"
                    onClick={() => setIsOnSearch(true)}
                  >
                    Back to Search
                  </Button>
                </CardHeader>
                <Divider />
                <CardBody className="flex-none">
                  <div className="p-5 text-justify">
                    {selectedJob && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        Location:
                        {selectedJob.location}
                      </div>
                    )}
                    <br></br>
                    {selectedJob !== undefined && (
                      <div className="flex items-center gap-2">
                        <FaMoneyCheckDollar />
                        Hourly salary: ${Number(selectedJob.salaryFrom)} - $
                        {Number(selectedJob.salaryTo)}
                      </div>
                    )}
                    <br></br>
                    {selectedJob && (
                      <p>
                        <b>Description:</b>
                        <br></br> {selectedJob.description}
                      </p>
                    )}
                    <br></br>
                    {selectedJob && (
                      <p>
                        <b>Qualification:</b> <br></br>
                        {selectedJob.qualifications}
                      </p>
                    )}
                  </div>
                </CardBody>
                <Divider />
                <CardFooter className="justify-between">
                  <Link
                    isExternal
                    showAnchorIcon
                    href={
                      (selectedJob !== undefined && selectedJob.siteURL) ||
                      "https://nextjs.org/"
                    }
                  >
                    Visit our company.
                  </Link>
                  <Button
                    color="primary"
                    variant="bordered"
                    startContent={<FaEye />}
                    onClick={onListOpen}
                    className={
                      selectedJob.employer == userAccount.address
                        ? "visible"
                        : "invisible"
                    }
                  >
                    Applications
                  </Button>
                  <Button
                    color="primary"
                    variant="bordered"
                    startContent={<FaBolt />}
                    onClick={applyJob}
                  >
                    Quick Apply
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Posting */}
      <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Job Posting
              </ModalHeader>
              <ModalBody>
                <Input
                  name="title"
                  type="text"
                  label="Job title"
                  labelPlacement="outside"
                  variant="underlined"
                  placeholder="Ex: Blockchain Developer"
                  onChange={handleChange}
                />
                <Input
                  name="location"
                  type="text"
                  label="Location"
                  labelPlacement="outside"
                  variant="underlined"
                  onChange={handleChange}
                  placeholder="Ex: Remote"
                />
                <div className="flex gap-4">
                  <Input
                    name="salaryFrom"
                    type="number"
                    label="Hourly salary Rate min"
                    labelPlacement="outside"
                    variant="underlined"
                    onChange={handleChange}
                    placeholder="Ex: $50"
                  />
                  <Input
                    name="salaryTo"
                    type="number"
                    label="Hourly salary Rate max"
                    labelPlacement="outside"
                    variant="underlined"
                    onChange={handleChange}
                    placeholder="Ex: $100"
                  />
                </div>
                <Input
                  name="siteURL"
                  type="text"
                  label="SiteURL"
                  labelPlacement="outside"
                  variant="underlined"
                  onChange={handleChange}
                  placeholder="Ex: https://vercel.com"
                />
                <Textarea
                  className="text-justify"
                  name="description"
                  variant="underlined"
                  label="Description"
                  labelPlacement="outside"
                  onChange={handleChange}
                  placeholder="Enter your job description"
                />
                <Textarea
                  className="text-justify"
                  name="qualifications"
                  variant="underlined"
                  label="Qualification"
                  labelPlacement="outside"
                  onChange={handleChange}
                  placeholder="Enter your job qualification"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={_postJob}
                  isLoading={isPendingPosting}
                >
                  {isPendingPosting ? "Posting..." : "Post"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal for Applying */}
      <Modal backdrop="opaque" isOpen={isAppOpen} onClose={onAppClose}>
        <ModalContent>
          {(onAppClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Apply for {selectedJob.title}
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4">
                  <Input
                    name="salaryApply"
                    type="number"
                    label="Hourly salary Rate"
                    labelPlacement="outside"
                    variant="underlined"
                    onChange={(event) =>
                      setSalaryApply(parseInt(event.target.value))
                    }
                    placeholder="Ex: $50"
                  />
                  <Input
                    name="locationApply"
                    type="text"
                    label="Location"
                    labelPlacement="outside"
                    variant="underlined"
                    onChange={(event) => setLocationApply(event.target.value)}
                    placeholder="Ex: Remote"
                  />
                </div>
                <Textarea
                  className="text-justify"
                  name="application"
                  variant="underlined"
                  label="Application"
                  labelPlacement="outside"
                  onChange={(event) => setApplication(event.target.value)}
                  placeholder="Enter your job application"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onAppClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={_applyJob}
                  isLoading={isPendingApplying}
                >
                  {isPendingApplying ? "Posting..." : "Post"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal for Job Posters */}
      <Modal
        backdrop="opaque"
        isOpen={isListOpen}
        onClose={onListClose}
        size="2xl"
      >
        <ModalContent>
          {(onListClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Applications for {selectedJob.title}
              </ModalHeader>
              <ModalBody>
                {selectedJob !== undefined &&
                selectedJob.employer == userAccount.address ? (
                  <ApplicationList jobId={selectedJob.id} />
                ) : (
                  ""
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onListClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

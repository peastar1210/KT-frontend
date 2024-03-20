import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";
import { type BaseError, useReadContract, useAccount } from "wagmi";
import TokenStatus from "./TokenStatus";

const Navbar = () => {
  const pathName = usePathname();
  const account = useAccount();

  return (
    <>
      <div className="fixed z-50 flex items-end justify-between w-full bg-white px-20 pt-4 pb-5 shadow-md">
        <Link href="/">
          <div className="text-xl lg:text-2xl text-blue-500 flex items-end">
            Dream
            <Image src="./logo.png" alt="logo" height={50} width={50} />
            Job
          </div>
        </Link>

        <div className="flex gap-3 text-sm md:gap-8 md:text-md lg:text-xl lg:gap-16">
          <Link
            className={
              pathName === "/jobs"
                ? "text-pink-500 underline underline-offset-8"
                : "text-blue-500"
            }
            href="/jobs"
          >
            Jobs
          </Link>
          <Link
            className={
              pathName === "/staking"
                ? "text-pink-500 underline underline-offset-8"
                : "text-blue-500"
            }
            href="/staking"
          >
            Stake
          </Link>
        </div>

        <div className="flex gap-10 items-center">
          {account.isConnected && <TokenStatus />}
          <w3m-button />
        </div>
      </div>
    </>
  );
};

export default Navbar;

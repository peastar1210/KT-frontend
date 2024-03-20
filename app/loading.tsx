import { Spinner } from '@nextui-org/react'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="h-screen w-full flex justify-center items-center bg-white">
        <Spinner size="lg" label="Loading..." color="success" />
      </div>
    </>
  )
}

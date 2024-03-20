'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="flex flex-col justify-center items-center">
        <h2>Something went wrong(global error)!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
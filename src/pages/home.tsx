import { getTestApi } from "@/api/test";
import { useQuery } from "@tanstack/react-query";

export function HomePage() {
  const { data, error, isPending } = useQuery({
    queryKey: ["test"],
    queryFn: getTestApi,
  });

  return (
    <>
      <div>Welcome to the Home Page</div>
      <div className="">
        {isPending && <div>Loading...</div>}
        {error && <div>Error: {(error as Error).message}</div>}
        {data && (
          <div>
            <pre className="whitespace-break-spaces">
              Data: {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}

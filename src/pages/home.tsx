import { getTestApi } from "@/api/test";
import { useQuery } from "@tanstack/react-query";
export function HomePage() {
  const { data, error, isPending } = useQuery({
    queryKey: ["test"],
    queryFn: getTestApi,
    select: (data) => data?.data,
  });

  return (
    <>
      <div>Welcome to the Home Page</div>
      <div className="">
        {isPending && <div>Loading...</div>}
        {error && <div>Error: {(error as Error).message}</div>}
        {!!data && <div>Data: {JSON.stringify(data)}</div>}
      </div>
    </>
  );
}

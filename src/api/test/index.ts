import { useAxios } from "@/hooks/useAxios";

export const getTestApi = async () => {
  return await useAxios({
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
    defaultErrorMessage: "Failed to fetch test API data",
  });
};

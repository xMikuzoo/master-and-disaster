export const getTestApi = async () => {
  return await fetch("https://jsonplaceholder.typicode.com/posts/1").then(
    (response) => response.json(),
  );
};

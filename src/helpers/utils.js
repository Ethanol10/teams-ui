export const readUrlQueryParam = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

import { navigate } from "astro:transitions/client";

export const updateURL = () => {
  const currentUrl = new URL(globalThis.location.href);
  const { search, sortBy, orderBy, groupBy } = fetchUrlParameters();

  updateUrl(currentUrl, "search", search);
  updateUrl(currentUrl, "sortBy", sortBy);
  updateUrl(currentUrl, "orderBy", orderBy);
  updateUrl(currentUrl, "groupBy", groupBy);

  navigate(currentUrl.toString());
};

const fetchUrlParameters = () => {
  const search = (document.getElementById("search") as HTMLInputElement).value;
  const sortBy = (document.getElementById("sortBy") as HTMLSelectElement).value;
  const orderBy = (document.getElementById("orderBy") as HTMLSelectElement)
    .value;
  const groupBy = (document.getElementById("groupBy") as HTMLSelectElement)
    .value;
  return { search, sortBy, orderBy, groupBy };
};

const updateUrl = (currentUrl: URL, key: string, value: string) => {
  if (value && value.trim().length > 0) {
    currentUrl.searchParams.set(key, value);
    return currentUrl;
  }
  if (currentUrl.searchParams.has(key)) {
    currentUrl.searchParams.delete(key);
  }
  return currentUrl;
};

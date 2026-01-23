import { navigate } from "astro:transitions/client";

export const  updateUrlParams = (key?: string, value?: string) => {
  const currentUrl = new URL(globalThis.location.href);
  const { search, sortBy, orderBy, groupBy, startDate, endDate } = fetchUrlParameters();

  updateUrl(currentUrl, "search", search);
  updateUrl(currentUrl, "sortBy", sortBy);
  updateUrl(currentUrl, "orderBy", orderBy);
  updateUrl(currentUrl, "groupBy", groupBy);
  if (startDate && endDate) {
    updateUrl(currentUrl, "startDate", startDate);
    updateUrl(currentUrl, "endDate", endDate);
  }
  if (key && value !== undefined) {
    updateUrl(currentUrl, key, value);
  }
  
  navigate(currentUrl.toString());
};

export const fetchUrlParameters = () => {
  const search = (document.getElementById("search") as HTMLInputElement).value;
  const sortBy = (document.getElementById("sortBy") as HTMLSelectElement).value;
  const orderBy = (document.getElementById("orderBy") as HTMLSelectElement)
    .value;
  const groupBy = (document.getElementById("groupBy") as HTMLSelectElement)
    .value;
  const startDate = (document.getElementById("startDate") as HTMLInputElement)
    .value;
  const endDate = (document.getElementById("endDate") as HTMLInputElement)
    .value;
  return { search, sortBy, orderBy, groupBy, startDate, endDate };
};

export const updateUrl = (currentUrl: URL, key: string, value: string) => {
  if (value && value.trim().length > 0) {
    currentUrl.searchParams.set(key, value);
    return currentUrl;
  }
  if (currentUrl.searchParams.has(key)) {
    currentUrl.searchParams.delete(key);
  }
  return currentUrl;
};

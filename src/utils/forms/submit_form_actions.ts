export const disableButton = (btn: HTMLButtonElement) => {
  btn.disabled = true;
  btn.classList.add("opacity-50", "cursor-not-allowed");
};

export const activateButton = (btn: HTMLButtonElement) => {
  btn.disabled = false;
  btn.classList.remove("opacity-50", "cursor-not-allowed");
};

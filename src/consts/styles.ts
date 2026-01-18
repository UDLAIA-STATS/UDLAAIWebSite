export const colors = {
  red: "#C10230",
  redDark: "#a10127",
  black: "#000000",
  containerBg: "#D9D9D9",
};

export const buttonClass = `text-[${colors.red}] bg-white border-[${colors.red}] border-solid border-2 px-4 py-2 rounded-md flex items-center justify-center cursor-pointer transition`;
export const inputClass = `bg-white text-black rounded-md p-2 w-md focus:outline-none focus:ring-2 focus:ring-[${colors.red}]`;

export const highlightedButtonClass =
    `bg-[${colors.red}] text-white border-2 border-[${colors.red}] rounded-md px-4 py-2 transition-all duration-200`;
export const disabledButtonClass =
    `bg-white text-[${colors.red}] border-2 border-[${colors.red}] rounded-md px-4 py-2 transition-all duration-200 hover:bg-[${colors.red}]/10`;

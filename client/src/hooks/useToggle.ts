import { useState } from "react";

export const useToggle = (initialState: boolean) => {
  const [toggleValue, setToggleValue] = useState<boolean>(initialState);

  const toggler = () => { setToggleValue(!toggleValue) };
  return [toggleValue, toggler]
};
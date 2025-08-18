"use client";

import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth에서 오류 발생");
  }
  return context;
};

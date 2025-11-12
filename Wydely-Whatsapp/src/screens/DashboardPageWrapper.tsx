import React from "react";
import { DashboardProvider } from "../context/DashboardContext";
import DashboardPage from "./DashboardPage";

export default function DashboardPageWrapper() {
  return (
    <DashboardProvider>
      <DashboardPage />
    </DashboardProvider>
  );
}

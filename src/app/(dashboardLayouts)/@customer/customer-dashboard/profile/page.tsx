"use client";

import CustomerProfilePage from "../../_components/CustomerProfilePage";
import CustomerSidebar from "../../_components/CustomerSidebar";

export default function CustomerProfileRoutePage() {
  return <div>
    <CustomerSidebar></CustomerSidebar>
    <CustomerProfilePage />
  </div>;
}
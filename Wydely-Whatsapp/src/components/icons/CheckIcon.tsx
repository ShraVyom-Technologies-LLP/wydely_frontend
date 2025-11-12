import * as React from "react";
import type { SVGProps } from "react";

const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Double checkmark for WhatsApp-style read receipts */}
    <polyline points="6 12 10 16 22 4" />
    <polyline points="2 12 6 16 10 12" />
  </svg>
);

export default CheckIcon;

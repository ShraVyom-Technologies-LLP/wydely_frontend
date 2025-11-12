import * as React from "react";
import type { SVGProps } from "react";

const ChatBubbleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.5 9.583A7.917 7.917 0 1 1 2.5 9.583c0 1.642.5 3.167 1.358 4.434L2.5 17.5l3.483-1.358A7.88 7.88 0 0 0 10 17.5a7.917 7.917 0 0 0 7.5-7.917"
    />
  </svg>
);

export default ChatBubbleIcon;
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input input-bordered h-9 w-full min-w-0 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none border border-base-content/20 bg-base-100 rounded-md file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-0 focus-visible:outline-none focus-visible:border-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

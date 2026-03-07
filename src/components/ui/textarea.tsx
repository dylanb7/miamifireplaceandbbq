import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "textarea textarea-bordered flex field-sizing-content min-h-16 w-full px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none border border-base-content/20 bg-base-100 rounded-md disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-0 focus-visible:outline-none focus-visible:border-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

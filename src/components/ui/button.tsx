import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive btn no-animation shadow-none min-h-0 h-9",
  {
    variants: {
      variant: {
        default: "btn-primary text-primary-foreground",
        destructive: "btn-error text-white",
        outline: "btn-outline",
        secondary: "btn-secondary text-secondary-foreground",
        ghost: "btn-ghost",
        link: "btn-link underline-offset-4",
      },
      size: {
        default: "px-4 py-2 has-[>svg]:px-3",
        sm: "btn-sm h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "btn-lg h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "btn-square size-9",
        "icon-sm": "btn-square size-8",
        "icon-lg": "btn-square size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const computedClassName = cn(buttonVariants({ variant, size, className }));

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(computedClassName, (children as React.ReactElement<any>).props.className),
      "data-slot": "button",
      ...props,
    });
  }

  return <button data-slot="button" className={computedClassName} {...props}>{children}</button>;
}

export { Button, buttonVariants };

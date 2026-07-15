import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium outline-none select-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(45,95,63,0.35)] hover:-translate-y-[1px]",
        secondary:
          "bg-surface-muted text-foreground rounded-lg border border-border hover:bg-border/40 hover:-translate-y-[1px]",
        outline:
          "border border-border text-foreground rounded-lg hover:bg-surface-muted hover:border-border-strong",
        ghost:
          "text-foreground-muted hover:text-foreground hover:bg-surface-muted rounded-lg",
        destructive:
          "bg-accent-red/20 text-accent-red-text rounded-lg hover:bg-accent-red/30 hover:-translate-y-[1px]",
        link: "text-primary underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-13 px-8 text-base",
        icon: "size-11 rounded-lg",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-13 rounded-lg",
      },
      loading: {
        true: "pointer-events-none opacity-70",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      render,
      ...props
    },
    ref
  ) => {
    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        nativeButton={!render}
        className={cn(buttonVariants({ variant, size, loading }), className)}
        disabled={disabled || loading}
        render={render}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </ButtonPrimitive>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

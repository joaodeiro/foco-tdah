import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input">

function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      autoCorrect={props.autoCorrect ?? "off"}
      autoCapitalize={props.autoCapitalize ?? "off"}
      spellCheck={props.spellCheck ?? false}
      className={cn(
        "w-full bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink",
        "placeholder:text-ink-faint",
        "focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15",
        "transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        type === "number" && "tabular-nums",
        className
      )}
      {...props}
    />
  )
}

export { Input }

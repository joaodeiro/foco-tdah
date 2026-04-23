import * as React from "react"

import { cn } from "@/lib/utils"

type TextareaProps = React.ComponentProps<"textarea">

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      autoComplete={props.autoComplete ?? "off"}
      className={cn(
        "w-full bg-surface border border-hairline rounded-xl px-4 py-3 text-[15px] text-ink leading-relaxed",
        "placeholder:text-ink-faint resize-none",
        "focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15",
        "transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

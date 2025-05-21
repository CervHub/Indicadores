"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  data: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Combobox({ data, value, onChange, placeholder = "Select...", className }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between truncate", className)}
        >
          <span className="truncate block">
            {value
              ? data.find((item) => item.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={`${item.value} ${item.label}`} // Aquí se concatena value y label
                  onSelect={(currentValue) => {
                    const selectedItem = data.find((item) =>
                      `${item.value} ${item.label}`.includes(currentValue)
                    )
                    onChange(selectedItem?.value || "")
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>

              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"

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
  onInputChange?: (value: string) => void
}

export function Combobox({ data, value, onChange, placeholder = "Select...", className, onInputChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Evita seleccionar con Enter si no hay resultados
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      (!data.some(item =>
        (`${item.value} ${item.label}`.toLowerCase().includes(search.toLowerCase()))
      ) || !search.trim())
    ) {
      e.preventDefault()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between truncate relative", className)}
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
          <div className="relative">
            <CommandInput
              placeholder="Search..."
              className="h-9 pr-8"
              value={search}
              onValueChange={val => {
                setSearch(val)
                if (onInputChange) onInputChange(val)
              }}
              onKeyDown={handleKeyDown}
            />
            {/* Trash icon inside the input, next to the search icon */}
            <Trash2
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={() => {
                setSearch("");
                if (onInputChange) onInputChange("");
              }}
              aria-label="Limpiar búsqueda"
              tabIndex={0}
              role="button"
            />
          </div>
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={`${item.value} ${item.label}`}
                  onSelect={(currentValue) => {
                    // Solo seleccionar si hay match exacto
                    const selectedItem = data.find((item) =>
                      `${item.value} ${item.label}`.toLowerCase() === currentValue.toLowerCase()
                    )
                    onChange(selectedItem?.value || "")
                    setOpen(false)
                    setSearch("")
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

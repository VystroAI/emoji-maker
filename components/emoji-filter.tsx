"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const filters = [
  {
    value: "latest",
    label: "Latest",
  },
  {
    value: "trending",
    label: "Trending",
  },
]

interface EmojiFilterProps {
  onFilterChange: (value: string) => void;
}

export function EmojiFilter({ onFilterChange }: EmojiFilterProps) {
  const [value, setValue] = React.useState("latest")

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Filter:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[140px] justify-between">
            {filters.find((filter) => filter.value === value)?.label}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {filters.map((filter) => (
            <DropdownMenuItem
              key={filter.value}
              onClick={() => {
                setValue(filter.value)
                onFilterChange(filter.value)
              }}
            >
              {filter.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 
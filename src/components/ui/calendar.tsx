import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        caption_dropdowns: "flex justify-center gap-1",
        vhidden: "hidden",
        dropdown_month: "relative inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        dropdown_year: "relative inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        dropdown: "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 dark:text-gray-200 dark:hover:bg-gray-700"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground dark:bg-purple-600 dark:text-white",
        day_today: "bg-accent text-accent-foreground dark:bg-gray-700 dark:text-gray-100",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30 dark:text-gray-500",
        day_disabled: "text-muted-foreground opacity-50 dark:text-gray-500",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Dropdown: ({ value, onChange, children, ...props }) => {
          const options = React.Children.toArray(children) as React.ReactElement[]
          const selected = options.find((child) => child.props.value === value)
          const [isOpen, setIsOpen] = React.useState(false)
          
          return (
            <div className="relative">
              <button
                type="button"
                className={cn(
                  "relative inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                )}
                onClick={() => setIsOpen(!isOpen)}
                {...props}
              >
                {selected?.props?.children}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </button>
              {isOpen && (
                <div className={cn(
                  "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                  "dark:bg-gray-800 dark:border dark:border-gray-600"
                )}>
                  {options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        "relative cursor-pointer select-none py-2 px-3 text-gray-900 hover:bg-gray-100 w-full text-left",
                        "dark:text-gray-200 dark:hover:bg-gray-700",
                        option.props.value === value && "bg-gray-100 dark:bg-gray-700"
                      )}
                      onClick={() => {
                        onChange?.({ target: { value: String(option.props.value) } } as any)
                        setIsOpen(false)
                      }}
                    >
                      {option.props.children}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
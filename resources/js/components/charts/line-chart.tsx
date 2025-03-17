"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Generar datos aleatorios para tres líneas a lo largo de varios años
const generateRandomData = () => {
  const data = []
  for (let year = 2020; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      data.push({
        date: `${year}-${String(month).padStart(2, '0')}-01`,
        line1: Math.floor(Math.random() * 500),
        line2: Math.floor(Math.random() * 500),
        line3: Math.floor(Math.random() * 500),
      })
    }
  }
  return data
}

const chartData = generateRandomData()

const chartConfig = {
  line1: {
    label: "Line 1",
    color: "hsl(var(--chart-1))",
  },
  line2: {
    label: "Line 2",
    color: "hsl(var(--chart-2))",
  },
  line3: {
    label: "Line 3",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const LineChartComponent = () => {
  const [selectedYear, setSelectedYear] = React.useState("2025")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    return date.getFullYear().toString() === selectedYear
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the selected year
          </CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a year"
          >
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="2025" className="rounded-lg">
              2025
            </SelectItem>
            <SelectItem value="2024" className="rounded-lg">
              2024
            </SelectItem>
            <SelectItem value="2023" className="rounded-lg">
              2023
            </SelectItem>
            <SelectItem value="2022" className="rounded-lg">
              2022
            </SelectItem>
            <SelectItem value="2021" className="rounded-lg">
              2021
            </SelectItem>
            <SelectItem value="2020" className="rounded-lg">
              2020
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <LineChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey="line1"
              type="monotone"
              stroke="var(--color-line1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="line2"
              type="monotone"
              stroke="var(--color-line2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="line3"
              type="monotone"
              stroke="var(--color-line3)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default LineChartComponent;

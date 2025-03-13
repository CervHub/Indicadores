import { DataTable } from '@/components/data-table';
import { FileStatus } from '@/components/file-status/columns';
import { Annex, getColumns } from '@/components/file-status/show/annex';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { findFieldByValue, findInArrayObject, formatDateTime, months } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anexos',
        href: '/annexes',
    },
    {
        title: 'Detalle',
        href: '/annexe/1',
    },
];

const tabData = [
    { value: 'anexo24', title: 'Anexo 24', description: 'Detalles del Anexo 24.' },
    { value: 'anexo25', title: 'Anexo 25', description: 'Detalles del Anexo 25.' },
    { value: 'anexo26', title: 'Anexo 26', description: 'Detalles del Anexo 26.' },
    { value: 'anexo27', title: 'Anexo 27', description: 'Detalles del Anexo 27.' },
    { value: 'anexo28', title: 'Anexo 28', description: 'Detalles del Anexo 28.' },
    { value: 'anexo30', title: 'Anexo 30', description: 'Detalles del Anexo 30.' },
    { value: 'minem1', title: 'Minem 1', description: 'Detalles del Minem 1.' },
    { value: 'minem2', title: 'Minem 2', description: 'Detalles del Minem 2.' },
];

interface InfoCardProps {
    data: {
        uea: string;
        contractorCompanyType: string;
        creationDate: string;
        month: string;
        year: string;
    };
}

function InfoCard({ data }: InfoCardProps) {
    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
                <CardDescription>Detalles del cliente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full grid-cols-1 items-center gap-4 md:grid-cols-2">
                    <div className="col-span-2 flex flex-col space-y-1.5">
                        <Label>UEA:</Label>
                        <Input value={data.uea || 'N/A'} readOnly />
                    </div>
                    <div className="span flex flex-col space-y-1.5">
                        <Label>TIPO DE CLIENTE:</Label>
                        <Input value={data.contractorCompanyType || 'N/A'} readOnly />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label>FECHA DE CREACION:</Label>
                        <Input value={data.creationDate || 'N/A'} readOnly />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label>MES:</Label>
                        <Input value={data.month || 'N/A'} readOnly />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label>AÑO:</Label>
                        <Input value={data.year || 'N/A'} readOnly />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  // ...more data...
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function CardWithForm() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function ContractorDashboard() {
    const { fileStatus, contractorCompanyTypes, ueas } = usePage<{
        contractorCompanyTypes: [];
        fileStatus: FileStatus;
        ueas: [];
    }>().props;

    const data = {
        contractorCompanyType:
            findInArrayObject(contractorCompanyTypes, 'id', fileStatus.contractor_company_type_id, 'name', (value) => Number(value)) || 'N/A',
        uea: findInArrayObject(ueas, 'id', fileStatus.uea_id, 'name', (value) => Number(value)) || 'N/A',
        creationDate: formatDateTime(fileStatus.created_at),
        month: findFieldByValue(months, 'value', fileStatus.month, 'label') || 'N/A',
        year: fileStatus.year || 'N/A',
        status: null,
    };

    console.log('File Status:', fileStatus);
    console.log('Contractor Company Types:', contractorCompanyTypes);
    console.log('UEAs:', ueas);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                        <InfoCard data={data} />
                    </div>
                    <div className="col-span-8">
                        <CardWithForm />
                    </div>
                </div>
                <Tabs defaultValue="anexo24" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                        {tabData.map((tab) => (
                            <>
                                <TabsTrigger key={`${tab.value}-sm`} value={tab.value} className="sm:hidden">
                                    {tab.value.toUpperCase()}
                                </TabsTrigger>
                                <TabsTrigger key={`${tab.value}-lg`} value={tab.value} className="hidden sm:block">
                                    {tab.title}
                                </TabsTrigger>
                            </>
                        ))}
                    </TabsList>
                    {tabData.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{tab.title}</CardTitle>
                                    <CardDescription>{tab.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {(() => {
                                        switch (tab.value) {
                                            case 'anexo24':
                                                return (
                                                    <DataTable
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex24) ? (fileStatus.annex24 as Annex[]) : []}
                                                    />
                                                );
                                            case 'anexo25':
                                                return (
                                                    <DataTable
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex25) ? (fileStatus.annex25 as Annex[]) : []}
                                                    />
                                                );
                                            case 'anexo26':
                                                return (
                                                    <DataTable
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex26) ? (fileStatus.annex26 as Annex[]) : []}
                                                    />
                                                );
                                            case 'anexo27':
                                                return (
                                                    <DataTable
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex27) ? (fileStatus.annex27 as Annex[]) : []}
                                                    />
                                                );
                                            default:
                                                return (
                                                    <div className="space-y-1">
                                                        <Label htmlFor={`${tab.value}-name`}>Nombre</Label>
                                                        <Input id={`${tab.value}-name`} />
                                                    </div>
                                                );
                                        }
                                    })()}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </AppLayout>
    );
}

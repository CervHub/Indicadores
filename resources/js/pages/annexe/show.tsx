import { DataTable } from '@/components/data-table';
import { FileStatus } from '@/components/file-status/columns';
import { Annex, getColumns } from '@/components/file-status/show/annex';
import { Annex28, getColumns as getColumns28 } from '@/components/file-status/show/annex28';
import { Annex30, getColumns as getColumns30 } from '@/components/file-status/show/annex30';
import { DataTable as DataTableAnnex } from '@/components/file-status/show/data-table';
import { MinemTemplate1, getColumns as getColumnsMinem1 } from '@/components/file-status/show/minem1';
import { MinemTemplate2, getColumns as getColumnsMinem2 } from '@/components/file-status/show/minem2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { findFieldByValue, findInArrayObject, formatDateTime, months } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import ChartComponent from './chart';

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
    { value: 'anexo24', title: 'Anexo 24', description: 'Detalles del Anexo 24.', abbreviation: 'A24' },
    { value: 'anexo25', title: 'Anexo 25', description: 'Detalles del Anexo 25.', abbreviation: 'A25' },
    { value: 'anexo26', title: 'Anexo 26', description: 'Detalles del Anexo 26.', abbreviation: 'A26' },
    { value: 'anexo27', title: 'Anexo 27', description: 'Detalles del Anexo 27.', abbreviation: 'A27' },
    { value: 'anexo28', title: 'Anexo 28', description: 'Detalles del Anexo 28.', abbreviation: 'A28' },
    { value: 'anexo30', title: 'Anexo 30', description: 'Detalles del Anexo 30.', abbreviation: 'A30' },
    { value: 'minem1', title: 'Minem 1', description: 'Detalles del Minem 1.', abbreviation: 'M1' },
    { value: 'minem2', title: 'Minem 2', description: 'Detalles del Minem 2.', abbreviation: 'M2' },
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-12 lg:col-span-4">
                        <InfoCard data={data} />
                    </div>
                    <div className="col-span-12 md:col-span-12 lg:col-span-8">
                        <ChartComponent data={fileStatus} />
                    </div>
                </div>
                <Tabs defaultValue="anexo24" className="w-full">
                    <TabsList className="grid w-full grid-cols-8">
                        {tabData.map((tab) => (
                            <React.Fragment key={tab.value}>
                                <TabsTrigger value={tab.value} className="sm:hidden">
                                    {tab.abbreviation}
                                </TabsTrigger>
                                <TabsTrigger value={tab.value} className="hidden sm:block">
                                    {tab.title}
                                </TabsTrigger>
                            </React.Fragment>
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
                                                    <DataTableAnnex
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex24) ? (fileStatus.annex24 as Annex[]) : []}
                                                    />
                                                );
                                            case 'anexo25':
                                                return (
                                                    <DataTableAnnex
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex25) ? (fileStatus.annex25 as Annex[]) : []}
                                                    />
                                                );
                                            case 'anexo26':
                                                return (
                                                    <DataTableAnnex
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex26) ? (fileStatus.annex26 as Annex[]) : []}
                                                    />
                                                );
                                            case 'anexo27':
                                                return (
                                                    <DataTableAnnex
                                                        columns={getColumns()}
                                                        data={Array.isArray(fileStatus.annex27) ? (fileStatus.annex27 as Annex[]) : []}
                                                    />
                                                );
                                            case 'anexo28':
                                                return (
                                                    <DataTable
                                                        columns={getColumns28()}
                                                        data={Array.isArray(fileStatus.annex28) ? (fileStatus.annex28 as Annex28[]) : []}
                                                    />
                                                );
                                            case 'anexo30':
                                                return (
                                                    <DataTable
                                                        columns={getColumns30()}
                                                        data={Array.isArray(fileStatus.annex30) ? (fileStatus.annex30 as Annex30[]) : []}
                                                    />
                                                );
                                            case 'minem1':
                                                return (
                                                    <DataTable
                                                        columns={getColumnsMinem1()}
                                                        data={
                                                            Array.isArray(fileStatus.minem_template1)
                                                                ? (fileStatus.minem_template1 as MinemTemplate1[])
                                                                : []
                                                        }
                                                    />
                                                );
                                            case 'minem2':
                                                return (
                                                    <DataTable
                                                        columns={getColumnsMinem2()}
                                                        data={
                                                            Array.isArray(fileStatus.minem_template2)
                                                                ? (fileStatus.minem_template2 as MinemTemplate2[])
                                                                : []
                                                        }
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

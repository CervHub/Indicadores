import { Annex, getColumns as annexGetColumns } from '@/components/consolidated/company/annex';
import { Annex28, getColumns as annex28GetColumns } from '@/components/consolidated/company/annex28';
import { Annex30, getColumns as annex30GetColumns } from '@/components/consolidated/company/annex30';
import { getColumns } from '@/components/consolidated/company/columns';
import { MinemTemplate1, getColumns as minem1GetColumns } from '@/components/consolidated/company/minem1';
import { MinemTemplate2, getColumns as minem2GetColumns } from '@/components/consolidated/company/minem2';
import { DataTable } from '@/components/file-status/show/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import ChartComponent from '@/pages/annexe/chart';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consolidados',
        href: '/consolidated',
    },
    {
        title: 'Detalle del Consolidado',
        href: '/consolidated/show',
    },
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

function addCompanyToAnnexes(fileStatuses: any[], annexKey: string): Annex[] {
    const annexes: Annex[] = [];
    fileStatuses.forEach((status: any) => {
        if (status[annexKey]) {
            status[annexKey].forEach((annex: any) => {
                annex.company = status.company.nombre;
                annex.uea = status.uea.name;
                annex.type = status.contractor_company_type.name;
                annexes.push(annex);
            });
        }
    });
    return annexes;
}

export default function ConsolidatedDetail() {
    const { consolidated, fileStatuses, companyConsolidateds } = usePage<{
        consolidated: any;
        fileStatuses: { contractor_company_id: number }[];
        ueas: any;
        contractorCompanyTypes: any;
        companyConsolidateds: any;
    }>().props;

    const uniqueCompanyIds = Array.from(new Set(fileStatuses.map((status: any) => status.contractor_company_id)));

    const companyWithData = companyConsolidateds
        .filter((company: any) => uniqueCompanyIds.includes(company.company_id))
        .map((company: any) => company.company);
    const companyWithoutData = companyConsolidateds
        .filter((company: any) => !uniqueCompanyIds.includes(company.company_id))
        .map((company: any) => company.company);

    const annex24s = addCompanyToAnnexes(fileStatuses, 'annex24');
    const annex25s = addCompanyToAnnexes(fileStatuses, 'annex25');
    const annex26s = addCompanyToAnnexes(fileStatuses, 'annex26');
    const annex27s = addCompanyToAnnexes(fileStatuses, 'annex27');
    const annex28s = addCompanyToAnnexes(fileStatuses, 'annex28');
    const annex30s = addCompanyToAnnexes(fileStatuses, 'annex30');
    const minemTemplate1 = addCompanyToAnnexes(fileStatuses, 'minem_template1');
    const minemTemplate2 = addCompanyToAnnexes(fileStatuses, 'minem_template2');

    const newFileStatus = {
        annex24: annex24s,
        annex25: annex25s,
        annex26: annex26s,
        annex27: annex27s,
        annex28: annex28s,
        annex30: annex30s,
        minem_template_1: minemTemplate1,
        minem_template_2: minemTemplate2,
    };

    console.log('File Statuses', fileStatuses);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detalle del Consolidado" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <InfoCard data={consolidated} />
                    </div>
                    <div className="col-span-12 md:col-span-12 lg:col-span-8">
                        <ChartComponent data={newFileStatus} />
                    </div>
                    <div className="col-span-12">
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
                                                            <DataTable
                                                                columns={annexGetColumns()}
                                                                data={Array.isArray(annex24s) ? (annex24s as Annex[]) : []}
                                                            />
                                                        );
                                                    case 'anexo25':
                                                        return (
                                                            <DataTable
                                                                columns={annexGetColumns()}
                                                                data={Array.isArray(annex25s) ? (annex25s as Annex[]) : []}
                                                            />
                                                        );
                                                    case 'anexo26':
                                                        return (
                                                            <DataTable
                                                                columns={annexGetColumns()}
                                                                data={Array.isArray(annex26s) ? (annex26s as Annex[]) : []}
                                                            />
                                                        );
                                                    case 'anexo27':
                                                        return (
                                                            <DataTable
                                                                columns={annexGetColumns()}
                                                                data={Array.isArray(annex27s) ? (annex27s as Annex[]) : []}
                                                            />
                                                        );
                                                    case 'anexo28':
                                                        return (
                                                            <DataTable
                                                                columns={annex28GetColumns()}
                                                                data={Array.isArray(annex28s) ? (annex28s as Annex28[]) : []}
                                                            />
                                                        );
                                                    case 'anexo30':
                                                        return (
                                                            <DataTable
                                                                columns={annex30GetColumns()}
                                                                data={Array.isArray(annex30s) ? (annex30s as Annex30[]) : []}
                                                            />
                                                        );
                                                    case 'minem1':
                                                        return (
                                                            <DataTable
                                                                columns={minem1GetColumns()}
                                                                data={Array.isArray(minemTemplate1) ? (minemTemplate1 as MinemTemplate1[]) : []}
                                                            />
                                                        );
                                                    case 'minem2':
                                                        return (
                                                            <DataTable
                                                                columns={minem2GetColumns()}
                                                                data={Array.isArray(minemTemplate2) ? (minemTemplate2 as MinemTemplate2[]) : []}
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
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contratas que subieron sus Excel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={getColumns()} data={companyWithData} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contratas que no subieron sus Excel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={getColumns()} data={companyWithoutData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

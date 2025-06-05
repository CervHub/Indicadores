'use client';

import { Report } from '@/types';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReportsDetailTableProps {
    data?: Report[];
}

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'generado':
            return 'bg-red-100 text-red-800 hover:bg-red-200';
        case 'visualizado':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        case 'cerrado':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

const getGravityColor = (gravity: string) => {
    switch (gravity?.toLowerCase()) {
        case 'alto':
        case 'alta':
            return 'bg-red-100 text-red-800 hover:bg-red-200';
        case 'medio':
        case 'media':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        case 'bajo':
        case 'baja':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

const getReportTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'actos':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        case 'condiciones':
            return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
        case 'incidentes':
            return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

const getReportTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'actos':
            return 'Actos Subestándar';
        case 'condiciones':
            return 'Condiciones Subestándar';
        case 'incidentes':
            return 'Incidentes';
        default:
            return type || 'N/A';
    }
};

export default function ReportsDetailTable({ data = [] }: ReportsDetailTableProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;

        return data.filter(
            (report) =>
                report.id?.toString().includes(searchTerm) ||
                report.tipoReporte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.descripcionEvento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.estadoReporte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.nivelGravedad?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [data, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = currentPage * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle>Detalle de Reportes</CardTitle>
                            <CardDescription>
                                {searchTerm ? <>Encontrados {filteredData.length} reportes • </> : null}
                                Mostrando {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} de{' '}
                                {filteredData.length} reportes
                            </CardDescription>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            placeholder="Buscar por ID, tipo, descripción, estado o gravedad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="overflow-auto">
                <TooltipProvider>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">ID</TableHead>
                                <TableHead className="w-32">Tipo</TableHead>
                                <TableHead className="w-40">Descripción</TableHead>
                                <TableHead className="w-32">Gravedad</TableHead>
                                <TableHead className="w-32">Estado</TableHead>
                                <TableHead className="w-32">Fecha Evento</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((report) => (
                                <Tooltip key={report.id} delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <TableRow className="cursor-help">
                                            <TableCell className="font-medium">{report.id}</TableCell>
                                            <TableCell>
                                                <Badge className={getReportTypeColor(report.tipoReporte || '')}>{getReportTypeLabel(report.tipoReporte || '')}</Badge>
                                            </TableCell>
                                            <TableCell className="max-w-40">
                                                <div className="truncate">{report.descripcionEvento || 'Sin descripción'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getGravityColor(report.nivelGravedad || '')}>{report.nivelGravedad || 'N/A'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(report.estadoReporte || '')}>{report.estadoReporte || 'N/A'}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {report.fechaEvento ? new Date(report.fechaEvento).toLocaleDateString('es-PE') : 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-sm p-4">
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>ID:</strong> {report.id || 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Tipo:</strong> {getReportTypeLabel(report.tipoReporte || '')}
                                            </div>
                                            <div>
                                                <strong>Descripción:</strong> {report.descripcionEvento || 'Sin descripción'}
                                            </div>
                                            <div>
                                                <strong>Gravedad:</strong> {report.nivelGravedad || 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Estado:</strong> {report.estadoReporte || 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Fecha:</strong>{' '}
                                                {report.fechaEvento ? new Date(report.fechaEvento).toLocaleDateString('es-PE') : 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Causa:</strong> {report.causaReporte || 'N/A'}
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                            {paginatedData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center">
                                        No se encontraron reportes
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}

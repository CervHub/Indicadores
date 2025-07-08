<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;

class ModulesExport implements FromCollection, WithHeadings, WithColumnWidths
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Modify the data to include hyperlinks and map new structure
        $modifiedData = array_map(function ($item) {
            $url = route('company.reportability.download', ['reportability_id' => $item->id]);

            // Calcular tiempo de resolución si hay fecha de cierre real
            $tiempoResolucion = '-';
            if ($item->reportClosedAt && $item->fechaEvento) {
                $fechaEvento = Carbon::parse($item->fechaEvento);
                $fechaCierre = Carbon::parse($item->reportClosedAt);
                $dias = $fechaEvento->diffInDays($fechaCierre);
                $horas = $fechaEvento->diffInHours($fechaCierre) % 24;
                $tiempoResolucion = $dias . ' días, ' . $horas . ' horas';
            }

            // Determinar el estado: Cerrado (si es Cerrado o Finalizador), Abierto en cualquier otro caso
            $estado = strtolower($item->estadoReporte);
            if ($estado === 'cerrado' || $estado === 'finalizado') {
                $estadoExport = 'Cerrado';
            } else {
                $estadoExport = 'Abierto';
            }

            return [
                'ID' => '=HYPERLINK("' . $url . '", "' . $item->id . '")',
                'GERENCIA' => $item->nombreGerencia,
                'TIPO DE REPORTE' => ucfirst($item->tipoReporte),
                'FECHA DEL EVENTO' => $item->fechaEvento,
                'GENERADO POR' => $item->nombreUsuarioReporta,
                'EMPRESA QUE REPORTA' => $item->nombreEmpresaReporta,
                'EMPRESA REPORTADA' => $item->nombreEmpresaReportada,
                'DESCRIPCION DEL EVENTO' => $item->descripcionEvento,
                'NIVEL DE GRAVEDAD' => $item->nivelGravedad,
                'ESTADO' => $estadoExport,
                'CAUSA' => $item->causaReporte,
                'RESPONSABLE DE CIERRE' => $item->nombreUsuarioCierre,
                'ING QUE CERRO REPORTE' => $item->nombreUsuarioRealmenteCerro ?? '-',
                'FECHA DE CIERRE' => $item->reportClosedAt ?? '-',
                'DIAS TRANSCURRIDOS' => $tiempoResolucion,

                // CAMPOS ADICIONALES DISPONIBLES - Descomenta para usar:
                // 'AREA_INVOLUCRADA' => $item->areaInvolucrada ?? '-',
                // 'USUARIO_REASIGNADO' => $item->nombreUsuarioReasignado ?? '-',
                // 'MOTIVO_REASIGNACION' => $item->motivoReasignacion ?? '-',
                // 'ELIMINADO_EN' => $item->eliminadoEn ?? '-',

                // IDs PARA REFERENCIAS - Descomenta si necesitas:
                // 'ID_CAUSA' => $item->idCausa,
                // 'ID_USUARIO_REPORTA' => $item->idUsuarioReporta,
                // 'ID_EMPRESA_REPORTA' => $item->idEmpresaReporta,
                // 'ID_EMPRESA_REPORTADA' => $item->idEmpresaReportada,
                // 'ID_USUARIO_CIERRE' => $item->idUsuarioCierre,
                // 'ID_USUARIO_REALMENTE_CERRO' => $item->idUsuarioRealmenteCerro,
                // 'ID_USUARIO_REASIGNADO' => $item->idUsuarioReasignado,
                // 'ID_GERENCIA' => $item->idGerencia,
            ];
        }, $this->data);

        return new Collection($modifiedData);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'GERENCIA',
            'TIPO DE REPORTE',
            'FECHA DEL EVENTO',
            'GENERADO POR',
            'EMPRESA QUE REPORTA',
            'EMPRESA REPORTADA',
            'DESCRIPCION DEL EVENTO',
            'NIVEL DE GRAVEDAD',
            'ESTADO',
            'CAUSA',
            'RESPONSABLE DE CIERRE',
            'ING QUE CERRO REPORTE',
            'FECHA DE CIERRE',
            'DIAS TRANSCURRIDOS',

            // HEADERS ADICIONALES - Descomenta junto con los campos:
            // 'AREA_INVOLUCRADA',
            // 'USUARIO_REASIGNADO',
            // 'MOTIVO_REASIGNACION',
            // 'ELIMINADO_EN',
            // 'ID_CAUSA',
            // 'ID_USUARIO_REPORTA',
            // 'ID_EMPRESA_REPORTA',
            // 'ID_EMPRESA_REPORTADA',
            // 'ID_USUARIO_CIERRE',
            // 'ID_USUARIO_REALMENTE_CERRO',
            // 'ID_USUARIO_REASIGNADO',
            // 'ID_GERENCIA',
        ];
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 10,  // ID
            'B' => 40,  // GERENCIA
            'C' => 20,  // TIPO DE REPORTE
            'D' => 25,  // FECHA DEL EVENTO
            'E' => 40,  // GENERADO POR
            'F' => 40,  // EMPRESA QUE REPORTA
            'G' => 40,  // EMPRESA REPORTADA
            'H' => 60,  // DESCRIPCION DEL EVENTO
            'I' => 15,  // NIVEL DE GRAVEDAD
            'J' => 20,  // ESTADO
            'K' => 50,  // CAUSA
            'L' => 40,  // RESPONSABLE DE CIERRE
            'M' => 40,  // ING QUE CERRO REPORTE
            'N' => 25,  // FECHA DE CIERRE
            'O' => 25,  // DIAS TRANSCURRIDOS

            // ANCHOS ADICIONALES - Descomenta junto con los campos:
            // 'P' => 30,  // AREA_INVOLUCRADA
            // 'Q' => 40,  // USUARIO_REASIGNADO
            // 'R' => 50,  // MOTIVO_REASIGNACION
            // 'S' => 25,  // ELIMINADO_EN
            // 'T' => 10,  // ID_CAUSA
            // 'U' => 15,  // ID_USUARIO_REPORTA
            // 'V' => 15,  // ID_EMPRESA_REPORTA
            // 'W' => 15,  // ID_EMPRESA_REPORTADA
            // 'X' => 15,  // ID_USUARIO_CIERRE
            // 'Y' => 15,  // ID_USUARIO_REALMENTE_CERRO
            // 'Z' => 15,  // ID_USUARIO_REASIGNADO
            // 'AA' => 15, // ID_GERENCIA
        ];
    }
}

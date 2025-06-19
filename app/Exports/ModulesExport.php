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
            
            return [
                'ID' => '=HYPERLINK("' . $url . '", "' . $item->id . '")',
                'GERENCIA' => $item->nombreGerencia,
                'TIPO_REPORTE' => ucfirst($item->tipoReporte),
                'FECHA_EVENTO' => $item->fechaEvento,
                'GENERADO_POR' => $item->nombreUsuarioReporta,
                'EMPRESA_QUE_GENERA' => $item->nombreEmpresaReporta,
                'EMPRESA_ENCARGADA_CIERRE' => $item->nombreEmpresaReportada,
                'DESCRIPCION_EVENTO' => $item->descripcionEvento,
                'NIVEL_GRAVEDAD' => $item->nivelGravedad,
                'ESTADO_REPORTE' => $item->estadoReporte,
                'CAUSA_REPORTE' => $item->causaReporte,
                'RESPONSABLE_CIERRE' => $item->nombreUsuarioCierre,
                'ING_QUE_CERRO_REPORTE' => $item->nombreUsuarioRealmenteCerro ?? '-',
                'FECHA_CIERRE_REAL' => $item->reportClosedAt ?? '-',
                'TIEMPO_RESOLUCION' => $tiempoResolucion,
                
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
            'TIPO_REPORTE',
            'FECHA_EVENTO',
            'GENERADO_POR',
            'EMPRESA_QUE_GENERA',
            'EMPRESA_ENCARGADA_CIERRE',
            'DESCRIPCION_EVENTO',
            'NIVEL_GRAVEDAD',
            'ESTADO_REPORTE',
            'CAUSA_REPORTE',
            'RESPONSABLE_CIERRE',
            'ING_QUE_CERRO_REPORTE',
            'FECHA_CIERRE_REAL',
            'TIEMPO_RESOLUCION',
            
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
            'C' => 20,  // TIPO_REPORTE
            'D' => 25,  // FECHA_EVENTO
            'E' => 40,  // GENERADO_POR
            'F' => 40,  // EMPRESA_QUE_GENERA
            'G' => 40,  // EMPRESA_ENCARGADA_CIERRE
            'H' => 60,  // DESCRIPCION_EVENTO
            'I' => 15,  // NIVEL_GRAVEDAD
            'J' => 20,  // ESTADO_REPORTE
            'K' => 50,  // CAUSA_REPORTE
            'L' => 40,  // RESPONSABLE_CIERRE
            'M' => 40,  // ING_QUE_CERRO_REPORTE
            'N' => 25,  // FECHA_CIERRE_REAL
            'O' => 25,  // TIEMPO_RESOLUCION
            
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
        ];
    }
}

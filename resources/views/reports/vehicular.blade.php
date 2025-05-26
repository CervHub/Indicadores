<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Inspección Pre-Uso Flota Liviana y Semipesada</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            /* reducido */
            color: #222;
            margin: 0;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }

        .header-table td {
            border: 1px solid #222;
            padding: 6px;
            vertical-align: middle;
        }

        .header-logo {
            text-align: center;
        }

        .header-title {
            text-align: center;
        }

        .header-meta {
            font-size: 10px;
        }

        .section-title {
            background: #f2f2f2;
            font-weight: bold;
            padding: 4px 8px;
            margin-top: 12px;
            border-left: 4px solid #0074c2;
        }

        .info-table,
        .causas-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        .info-table td,
        .causas-table th,
        .causas-table td {
            border: 1px solid #bbb;
            padding: 4px 6px;
        }

        .causas-table th {
            background: #e6e6e6;
            font-weight: bold;
        }

        .images-row {
            margin: 8px 0 12px 0;
            display: flex;
            gap: 8px;
        }

        .images-row img {
            max-width: 120px;
            max-height: 80px;
            border: 1px solid #ccc;
            padding: 1px;
            background: #fafafa;
        }

        .table-general {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            font-size: 10px;
            /* reducido */
        }

        .table-general th,
        .table-general td {
            border: 1px solid #222;
            padding: 3px 4px;
            text-align: center;
        }

        .table-general th {
            background: #e6e6e6;
            font-weight: bold;
        }

        .table-general .col-item {
            width: 40%;
            text-align: left;
            font-size: 10px;
        }

        .table-general .col-estado {
            width: 8%;
        }

        .table-general .col-n {
            width: 4%;
        }

        .table-general .col-obs {
            width: 20%;
            text-align: left;
        }

        .table-observacion {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            font-size: 10px;
        }

        .table-observacion th,
        .table-observacion td {
            border: 1px solid #222;
            padding: 5px;
            text-align: left;
        }

        .table-observacion th {
            background: #e6e6e6;
            font-weight: bold;
            width: 20%;
        }

        .th-mayus {
            text-transform: uppercase;
        }

        .x-mark {
            font-weight: bold;
            font-size: 14px;
            color: #222;
        }
    </style>
</head>

<body>
    <table class="header-table">
        <tr>
            <td style="width:20%;" class="header-logo">
                <img src="{{ public_path('logos/grupomexico.png') }}" alt="Logo"
                    style="max-width: 100px; max-height: 60px;">
            </td>
            <td style="width:60%;" class="header-title">
                <div class="th-mayus" style="font-weight:bold; font-size:16px;">INSPECCIÓN VEHICULAR</div>
              
            </td>
            <td style="width:20%;" class="header-meta">
                <div class="th-mayus"><b>Código:</b> SCJ-RE-18</div>
                <div class="th-mayus"><b>Versión:</b> 03</div>
                <div class="th-mayus"><b>Fecha:</b> 20/09/2021</div>
                <div class="th-mayus"><b>Página:</b> 1 de 1</div>
            </td>
        </tr>
    </table>

    <table style="width:100%; border-collapse:collapse; margin-bottom: 18px;">
        <tr>
            <th colspan="8" class="th-mayus" style="border:1px solid #222; text-align:center;">DESCRIPCIÓN DE LA
                UNIDAD
            </th>
        </tr>
        <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold; width:14%;">Empresa</td>
            <td colspan="7" style="border:1px solid #222;">
                {{ $empresa_nombre ?? '' }}
            </td>
        </tr>
        <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Tipo</td>
            <td colspan="7" style="border:1px solid #222; text-align:left;">
                {{-- Checkboxes para tipos de vehículos --}}
                @php
                    $tipos = ['Camioneta', 'Combi', 'Ambulancia', 'Bus', 'Camión', 'Camión grúa', 'Otros'];
                    $tipoActual = $vehicle->type ?? '';
                @endphp
                @foreach ($tipos as $tipo)
                    <label>
                        <input type="checkbox" style="vertical-align:middle; margin-right:2px; background:transparent;"
                            {{ $tipoActual == $tipo ? 'checked' : '' }}>
                        <span style="vertical-align:middle;">{{ $tipo }}</span>
                    </label>
                @endforeach
            </td>
        </tr>
        <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Marca</td>
            <td colspan="3" style="border:1px solid #222;">
                {{ $vehicle->brand ?? '' }}
            </td>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Modelo</td>
            <td colspan="3" style="border:1px solid #222;">
                {{ $vehicle->model ?? '' }}
            </td>
        </tr>
        <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Nº Motor</td>
            <td colspan="3" style="border:1px solid #222;">
                {{ $vehicle->engine_number ?? '' }}
            </td>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Año</td>
            <td style="border:1px solid #222;">
                {{ $vehicle->year ?? '' }}
            </td>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Placa</td>
            <td style="border:1px solid #222;">
                {{ $vehicle->license_plate ?? '' }}
            </td>
        </tr>
        {{-- Eliminado conductor y número de licencia --}}
        {{-- <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Estado General del Vehículo</td>
            <td colspan="3" style="border:1px solid #222;">
                {{ $details['estado_general'] ?? '' }}
            </td>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Código Autogenerado</td>
            <td colspan="3" style="border:1px solid #222;">
                {{ $vehicle->code ?? '' }}
            </td>
        </tr> --}}
    </table>

    @php
        $grouped = collect($causas ?? [])->groupBy('nombre_grupo');
        $counter = 1;
        $tieneMal = collect($causas ?? [])->contains(fn($c) => ($c['state'] ?? '') === 'Mal');
    @endphp

    <table class="table-general">
        <tr>
            <th class="th-mayus col-n">N</th>
            <th class="th-mayus col-item">Item</th>
            <th class="th-mayus col-estado">Bien</th>
            <th class="th-mayus col-estado">Mal</th>
            <th class="th-mayus col-estado">No aplica</th>
            <th class="th-mayus col-obs">Observaciones</th>
        </tr>
        @foreach ($grouped as $grupo => $items)
            <tr>
                <th colspan="6" style="text-align:left; background:#e6e6e6;">{{ $grupo }}</th>
            </tr>
            @foreach ($items as $causa)
                <tr>
                    <td>{{ $counter }}</td>
                    <td class="col-item">{{ $causa['nombre_categoria'] ?? '' }}</td>
                    <td class="col-estado">
                        @if (($causa['state'] ?? '') === 'Conforme')
                            <span class="x-mark">X</span>
                        @endif
                    </td>
                    <td class="col-estado">
                        @if (($causa['state'] ?? '') === 'No Conforme')
                            <span class="x-mark">X</span>
                        @endif
                    </td>
                    <td class="col-estado">
                        @if (($causa['state'] ?? '') === 'No Aplica')
                            <span class="x-mark">X</span>
                        @endif
                    </td>
                    <td class="col-obs">
                        {{ $causa['observation'] ?? '' }}
                    </td>
                </tr>
                @php $detalleIndex = 1; @endphp
                @if (!empty($causa['extraForm']) && is_array($causa['extraForm']))
                    @foreach ($causa['extraForm'] as $detalle)
                        @php
                            $valor = $detalle['value'] ?? '';
                            $isDate = false;
                            $isNumber = false;
                            $isEmpty = false;
                            $bien = false;
                            $mal = false;
                            $noaplica = false;
                            // Detectar si es fecha válida
                            if (is_string($valor) && preg_match('/^\d{4}-\d{2}-\d{2}/', $valor)) {
                                $isDate = true;
                            } elseif (is_numeric($valor)) {
                                $isNumber = true;
                            } elseif (is_string($valor)) {
                                $isEmpty = trim($valor) === '';
                            }
                            if ($isDate) {
                                try {
                                    $fechaValor = \Carbon\Carbon::parse($valor)->startOfDay();
                                    $hoy = \Carbon\Carbon::now()->startOfDay();
                                    $bien = $fechaValor->greaterThanOrEqualTo($hoy);
                                    $mal = !$bien;
                                } catch (\Exception $e) {
                                    $mal = true;
                                }
                            } elseif ($isNumber) {
                                $bien = floatval($valor) >= 0;
                                $mal = !$bien;
                            } elseif ($isEmpty) {
                                $mal = true;
                            } else {
                                $bien = true;
                            }
                        @endphp
                        <tr>
                            <td>{{ $counter . '.' . $detalleIndex }}</td>
                            <td class="col-item" colspan="1" style="text-align:left; font-style:italic; color:#444;">
                                {{ $detalle['name'] ?? '' }}
                            </td>
                            <td class="col-estado">
                                @if ($bien)
                                    <span style="font-size:10px; font-weight:bold;">x</span>
                                @endif
                            </td>
                            <td class="col-estado">
                                @if ($mal)
                                    <span style="font-size:10px; font-weight:bold;">x</span>
                                @endif
                            </td>
                            <td class="col-estado">
                                {{-- No aplica solo si explícitamente lo deseas marcar --}}
                            </td>
                            <td style="text-align:left; font-style:italic; color:#444;">
                                {{ $detalle['value'] ?? '' }}
                            </td>
                        </tr>
                        @php $detalleIndex++; @endphp
                    @endforeach
                @endif
                @php $counter++; @endphp
            @endforeach
        @endforeach
    </table>


    <table class="table-observacion">
        <tr>
            <th class="th-mayus">Observación</th>
        </tr>
        <tr>
            <td>
                {{ $details['observation'] ?? 'Sin observaciones.' }}
            </td>
        </tr>
    </table>

    {{-- Estado final de la inspección --}}
    <table style="width:100%; border-collapse:collapse; margin-top: 18px; font-size:11px;">

        <tr>
            <td style="width:50%; text-align:left;">
                <span style="vertical-align:middle;">APROBADO</span>
                <input type="checkbox" style="vertical-align:middle; margin-right:2px;"
                    {{ !$tieneMal ? 'checked' : '' }}>
            </td>

            <td style="text-align:left; width:20%;" class="th-mayus">Inspeccionado por:</td>
            <td style="">
                {{ $usuario_nombre ?? '' }}
            </td style="text-align:left;">
        </tr>
        <tr>
            <td style="width:50%; text-align:left;">
                <span style="vertical-align:middle;">DESAPROBADO</span>
                <input type="checkbox" style="vertical-align:middle; margin-right:2px;"
                    {{ $tieneMal ? 'checked' : '' }}>
            </td>
            <td class="th-mayus" style="text-align:left; width:20%;">Fecha de inspección:</td>
            <td style="text-align:left;">
                {{ $date ? \Carbon\Carbon::createFromFormat('d/m/Y H:i:s', $date)->setTimezone('America/Lima')->format('d/m/Y H:i:s') : '' }}
            </td>
        </tr>
    </table>

    @if (!empty($images) && is_array($images))
        <div style="margin-top:18px;">
            <div class="th-mayus" style="font-weight:bold; margin-bottom:6px;">IMÁGENES</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                @foreach ($images as $img)
                    <div style="margin-bottom:8px;">
                        <img src="{{ public_path($img) }}"
                            style="max-width:45%; max-height:auto; border:1px solid #bbb; padding:2px; background:#fafafa;">
                    </div>
                @endforeach
            </div>
        </div>
    @endif

</body>

</html>

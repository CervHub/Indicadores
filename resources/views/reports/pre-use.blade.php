<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Inspección Pre-Uso Flota Liviana y Semipesada</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            color: #222;
            margin: 0;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }

        .header-table td {
            border: 1px solid #222;
            padding: 8px;
            vertical-align: middle;
        }

        .header-logo {
            text-align: center;
        }

        .header-title {
            text-align: center;
        }

        .header-meta {
            font-size: 12px;
        }

        .section-title {
            background: #f2f2f2;
            font-weight: bold;
            padding: 6px 10px;
            margin-top: 18px;
            border-left: 4px solid #0074c2;
        }

        .info-table,
        .causas-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }

        .info-table td,
        .causas-table th,
        .causas-table td {
            border: 1px solid #bbb;
            padding: 6px 8px;
        }

        .causas-table th {
            background: #e6e6e6;
            font-weight: bold;
        }

        .images-row {
            margin: 10px 0 20px 0;
            display: flex;
            gap: 10px;
        }

        .images-row img {
            max-width: 180px;
            max-height: 120px;
            border: 1px solid #ccc;
            padding: 2px;
            background: #fafafa;
        }

        .table-general {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }

        .table-general th,
        .table-general td {
            border: 1px solid #222;
            padding: 6px 8px;
            text-align: center;
        }

        .table-general th {
            background: #e6e6e6;
            font-weight: bold;
        }

        .table-general .col-item {
            width: 64%;
            text-align: left;
        }

        .table-general .col-estado {
            width: 12%;
        }

        .table-observacion {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }

        .table-observacion th,
        .table-observacion td {
            border: 1px solid #222;
            padding: 8px;
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
            font-size: 18px;
            color: #222;
        }
    </style>
</head>

<body>
    <table class="header-table">
        <tr>
            <td style="width:20%;" class="header-logo">
                {{-- Logo de la empresa --}}
                <img src="{{ public_path('logos/grupomexico.png') }}" alt="Logo"
                    style="max-width: 100px; max-height: 60px;">
            </td>
            <td style="width:60%;" class="header-title">
                <div class="th-mayus" style="font-weight:bold; font-size:16px;">REGISTRO</div>
                <div class="th-mayus" style="font-weight:bold; font-size:18px;">INSPECCIÓN DE PRE-USO FLOTA LIVIANA Y
                    SEMIPESADA
                </div>
            </td>
            <td style="width:20%;" class="header-meta">
                <div class="th-mayus"><b>Código:</b> SCJ-RE-106</div>
                <div class="th-mayus"><b>Versión:</b> 00</div>
                <div class="th-mayus"><b>Fecha:</b> 07/02/2023</div>
                <div class="th-mayus"><b>Página:</b> 1 de 1</div>
            </td>
        </tr>
    </table>

    <table style="width:100%; border-collapse:collapse; margin-bottom: 18px;">
        <tr>
            <td class="th-mayus" style="width:20%; border:1px solid #222; font-weight:bold;">Código del vehículo
            </td>
            <td style="width:30%; border:1px solid #222;">
                {{ $vehicle->code ?? '' }}
            </td>
            <td class="th-mayus" style="width:20%; border:1px solid #222; font-weight:bold;">Dpto / Sección
            </td>
            <td style="width:30%; border:1px solid #222;">
                {{ $details['department'] ?? '' }}
            </td>
        </tr>
        <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Fecha</td>
            <td style="border:1px solid #222;">
                {{ $date ?? '' }}
            </td>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Turno</td>
            <td style="border:1px solid #222;">
                {{ $details['shift'] ?? '' }}
            </td>
        </tr>
        <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Conductor</td>
            <td style="border:1px solid #222;" colspan="3">
                {{ $details['driver'] ?? '' }}
            </td>
        </tr>
        <tr>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;">Kilometraje</td>
            <td style="border:1px solid #222;">
                {{ $details['mileage'] ?? '' }}
            </td>
            <td class="th-mayus" style="border:1px solid #222; font-weight:bold;"></td>
            <td style="border:1px solid #222;">
                {{ $details['registro'] ?? '' }}
            </td>
        </tr>
    </table>

    <table class="table-general">
        <tr>
            <th class="th-mayus col-item" rowspan="2">Item</th>
            <th class="th-mayus col-estado" colspan="3">Estado</th>
        </tr>
        <tr>
            <th class="th-mayus col-estado">Bien</th>
            <th class="th-mayus col-estado">Mal</th>
            <th class="th-mayus col-estado">No aplica</th>
        </tr>
        @foreach ($causas ?? [] as $causa)
            <tr>
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
                    @if (($causa['state'] ?? '') === 'No aplica')
                        <span class="x-mark">X</span>
                    @endif
                </td>
            </tr>
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

</body>

</html>

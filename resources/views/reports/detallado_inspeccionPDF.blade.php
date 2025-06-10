<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reporte Toquepala</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        table {
            border-collapse: collapse;
        }

        /* Estilos de cabecera */
        .header {
            width: 100%;
            height: 40px;
        }

        .header td {
            width: 50%;
            vertical-align: middle;
            padding: 0px;
            margin: 0px;
        }

        .header img {
            max-width: 120px;
            height: auto;
        }

        .header .text {
            text-align: right;
            font-size: 11px; // Añade esta línea
            font-family: Arial, sans-serif; // Añade esta línea
        }

        .negrita {
            font-weight: bold;
        }

        .text-center {
            text-align: center !important;
        }

        .mt-0 {
            margin-top: 0 !important;
        }

        .mb-0 {
            margin-bottom: 0 !important;
        }

        .mb-1 {
            margin-bottom: 5px !important;
        }

        /* Estilos de cuerpo */
        h1 {
            font-size: 25px;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
        }

        .cell {
            border: 1px solid black;
            height: 20px;
            width: 20px;
        }

        .tipo_actos table td {
            height: 50px;
        }

        .header-content-table {
            padding-left: 30px;
        }

        .mt-3 {
            margin-top: 20px;
        }

        .firma {
            width: 130px;
            height: 50px;
            position: relative;
        }

        .border {
            border: 1px solid black;
            padding: 5px;
        }

        .text-jusify {
            text-align: justify;
        }

        .evaluacion td,
        .evaluacion th {
            text-align: center;
            height: 40px;
            padding: 5px;
        }

        .x-centered {
            font-size: 30px;
            font-weight: bold;
        }

        /* Nueva clase para imágenes */
        .fixed-height-img {
            max-height: 300px;
            max-width: 900px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 20px;
            /* Añade esta línea para el gap */
        }
    </style>
</head>

<body>
    <table class="header">
        <tr>
            <td><img src="{{ $logo }}" alt="Logo"></td>
            <td class="text negrita text-center">
                "Un acto/condición sub estándar o un incidente reportado es un ACCIDENTE EVITADO"
            </td>
        </tr>
    </table>
    <h1 class="text-center mt-0">ESTOY REALIZANDO UNA INSPECCIÓN</h1>
    <section class="tipo_inspeccion">
        <table style="width: 100%;">
            <tr>
                <td style="width: 20%;" class="header-content-table">
                    Planeada
                </td>
                <td class="cell x-centered text-center" style="width: 5%;">
                    {{ $reportability->tipo_inspeccion == 'PLANEADA' ? 'X' : '' }}
                </td>
                <td style="width: 20%;" class="header-content-table">
                    No Planeada
                </td>
                <td class="cell x-centered text-center" style="width: 5%;">
                    {{ $reportability->tipo_inspeccion == 'NO PLANEADA' ? 'X' : '' }}
                </td>
                <td style="width: 20%;" class="header-content-table">
                    Comité
                </td>
                <td class="cell x-centered text-center" style="width: 5%;">
                    {{ $reportability->tipo_inspeccion == 'COMITE' ? 'X' : '' }}
                </td>
                <td style="width: 20%;" class="header-content-table">
                    Otros
                </td>
                <td class="cell x-centered text-center" style="width: 5%;">
                    {{ $reportability->tipo_inspeccion == 'OTROS' ? 'X' : '' }}
                </td>
            </tr>
        </table>
    </section>

    <section class="datos_reporte mt-3">
        <table style="width: 100%;">
            <tr>
                <td style="width: 50%;" class="cell">
                    <strong>Inspeccionado por:</strong>
                    <br>
                    {{ $reportability->reportado() }}
                </td>
                <td style="width: 50%;" class="cell text-center">
                    <img src="data:image/png;base64,{{ $reportability->firma }}" class="firma" alt="Firma">
                </td>
            </tr>
        </table>
        <table style="width: 100%;">
            <tr>
                <td style="width: 50%;" class="cell">
                    <strong>Fecha de Inspección:</strong>
                    <br>
                    {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('d-m-Y H:i:s') }}
                </td>

            </tr>
        </table>


        <table style="width: 100%; margin-top:-1.5px;">
            <tr>
                <td style="width: 33%;" class="cell">
                    <strong>Empresa:</strong>
                    <br>
                    {{ strtoupper($reportability->user->company->nombre) }}
                </td>
            </tr>
            <tr>
                @foreach ($reportability->levels() as $key => $names)
                    @if ($key == 'gerencia')
                        @php
                            $key = ucfirst($key);
                            $key = str_replace('Taller_seccion', 'Taller/Sección', $key);
                        @endphp
                        <td style="width:33%;" class="cell">
                            <strong>{{ $key }}:</strong>
                            <br>
                            {{ $names }}
                        </td>
                    @endif
                @endforeach
            </tr>

        </table>
        <table style="width: 100%; margin-top:-1.5px;">
            <tr>
                <td style="width: 33%;" class="cell">
                    <strong>Estado:</strong>
                    <br>
                    {{ strtoupper($reportability->estado) }}
                </td>
            </tr>
        </table>
    </section>

    <section>
        <h4 class="mb-1">LUGAR</h4>
        <div style="width: 100%; border: 1px solid black; padding:2px;">
            {{ ucfirst(strtolower($reportability->lugar)) }}
        </div>
    </section>


    <section class="detalles-grilla" style="width: 100%;">
        <h1 style="text-align: left;">Detalles de Inspección</h1>
        @php
            $details = $reportability->imagesPI();
            if (is_null($details)) {
                $details = []; // Asegura que $details sea un array, incluso si $reportability->details es null.
            }
        @endphp

        @foreach ($details as $detail)
            <div class="detalle-grilla" style="margin-bottom: 40px;">
                <!-- Aumenta el margen inferior para dar espacio a las fotos -->
                <table class="table table-bordered"
                    style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px;">
                    <!-- Añade margen inferior -->
                    <colgroup>
                        <col style="width: 30%;"> <!-- Ajusta el ancho del encabezado -->
                        <col style="width: 70%;"> <!-- Ajusta el ancho del contenido -->
                    </colgroup>
                    <tbody>
                        <tr>
                            <th style="text-align: left; border: 1px solid black; width: 250px;">Tipo de Detalle</th>
                            <td style="text-align: left; border: 1px solid black;">{{ $detail['tipo_detalle'] }}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; border: 1px solid black; width: 250px;">Riesgo</th>
                            <td style="text-align: left; border: 1px solid black;">{{ substr($detail['riesgo'], 3) }}
                            </td>
                        </tr>
                        <tr>
                            <th style="text-align: left; border: 1px solid black; width: 250px;">Observación</th>
                            <td style="text-align: left; border: 1px solid black;">{{ $detail['observacion'] }}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; border: 1px solid black; width: 250px;">Acción Correctiva</th>
                            <td style="text-align: left; border: 1px solid black;">{{ $detail['correctiva'] }}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; border: 1px solid black; width: 250px;">Responsable</th>
                            <td style="text-align: left; border: 1px solid black;">{{ $detail['nombre_responsable'] }}
                            </td>
                        </tr>
                        <tr>
                            <th style="text-align: left; border: 1px solid black; width: 250px;">Fecha de Cumplimiento
                            </th>
                            <td style="text-align: left; border: 1px solid black;">
                                {{ str_replace('/', '-', $detail['fecha_cumplimiento']) }}</td>
                        </tr>
                    </tbody>
                </table>
                <div style="margin-top: 10px; margin-bottom: 20px;"><strong>Fotos:</strong></div>
                @if (isset($detail['fotos']) && is_array($detail['fotos']) && count($detail['fotos']) > 0)
                    @foreach ($detail['fotos'] as $foto)
                        @if (isset($foto['base64']))
                            <div style="width: 100%; text-align: center; margin: 1% 0;">
                                <img src="data:image/jpeg;base64,{{ trim($foto['base64']) }}" class="fixed-height-img">
                            </div>
                        @endif
                    @endforeach
                @else
                    <div style="text-align: center; padding: 5px;">Sin fotos</div>
                @endif
            </div>
        @endforeach
    </section>

    <section>
        <h4 class="negrita mb-1">SE REPORTA : </h4>
        @php
            $cellWidth = 'auto';
        @endphp
        <table class="table" style="width: 100%;">
            <thead>
                <tr>
                    <th class="cell" style="width: 5%">#</th>
                    <th class="cell" style="width: {{ $cellWidth }}">Nombre</th>
                    <th class="cell" style="width: {{ $cellWidth }}">Correo</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $engineers = json_decode($reportability->send_email) ?? [];
                @endphp

                @forelse ($engineers as $index => $engineer)
                    <tr>
                        <td class="cell" style="width: 5%">{{ $index + 1 }}</td>
                        <td class="cell" style="width: {{ $cellWidth }}">{{ $engineer->nombre }}
                            {{ $engineer->apellidos }}</td>
                        <td class="cell" style="width: {{ $cellWidth }}">{{ $engineer->email }}</td>
                    </tr>
                @empty
                    <tr>
                        <td class="cell text-center" colspan="3">No hay ingenieros de seguridad notificados.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </section>

    @php
        $finalizado = $reportability->moduleReview;
    @endphp

    @php
        $finalizado = $reportability->moduleReview;
    @endphp

    @if ($finalizado)


        {{-- Siguiente pagina --}}
        <div style="page-break-before: always;"></div>


        @php
            $user = $finalizado->user;
            $fotos = json_decode($finalizado->fotos);
        @endphp

        <section class="datos_reporte mt-3">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid">
                        <strong style="font-size: 1.2em;">Reporte Finalizado</strong>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid">
                        <span style="font-size: 1em;">Finalizado por: {{ $user->nomres }}
                            {{ $user->apellidos }}</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid">
                        <span style="font-size: 1em;">Comentario: {{ $finalizado->comentario }}</span>
                    </td>
                </tr>
            </table>

            <strong
                style="font-size: 1.1em; color: black; margin-top: 20px; margin-bottom:20px; display: block;">ANEXOS:</strong>
            <table style="width: 100%; border-collapse: collapse;">
                @foreach ($fotos as $foto)
                    @if (Str::endsWith($foto, ['.png', '.jpg', '.jpeg']))
                        <tr style="margin-bottom: 10px;">
                            <td style="text-align: center; border: none;">
                                <img src="{{ $url . '/' . $foto }}" alt="Foto del reporte" class="fixed-height-img">
                            </td>
                        </tr>
                    @else
                        <tr style="margin-bottom: 10px;">
                            <td style="text-align: left; border: none;">
                                <a href="{{ url($foto) }}" target="_blank"
                                    style="text-decoration: none; color: blue;">
                                    {{ basename($foto) }}
                                </a>
                            </td>
                        </tr>
                    @endif
                @endforeach
            </table>
        </section>
    @endif
</body>

</html>

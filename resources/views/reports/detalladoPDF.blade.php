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
    <h1 class="text-center mt-0">ESTOY REPORTANDO UN(A)</h1>
    <section class="tipo_actos">
        <table style="width: 100%;">
            <tr>
                <td style="width: 30%;" class="header-content-table">
                    Acto subestándar
                </td>
                <td class="cell x-centered text-center" style="width: 10%;">
                    {{ $reportability->tipo_reporte == 'actos' ? 'X' : '' }}
                </td>
                <td style="width: 30%;" class="header-content-table">
                    Condición subestándar
                </td>
                <td class="cell x-centered text-center" style="width: 10%;">
                    {{ $reportability->tipo_reporte == 'condiciones' ? 'X' : '' }}
                </td>
                <td style="width: 30%;" class="header-content-table">
                    Incidente
                </td>
                <td class="cell x-centered text-center" style="width: 10%;">
                    {{ $reportability->tipo_reporte == 'incidentes' ? 'X' : '' }}
                </td>
            </tr>
        </table>
    </section>
    <section class="fechas_reportes mt-3">
        <table style="width: 100%;">
            <tr>
                <td style="width: 30%;" class="header-content-table">
                    Fecha del Evento
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('d') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('m') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('Y') }}
                </td>
                <td></td>
                <td style="width: 30%;" class="header-content-table">
                    Fecha del Reporte
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('d') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('m') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('Y') }}
                </td>
            </tr>
            <tr>
                <td style="width: 30%;" class="header-content-table">
                    Hora del Evento
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('H') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('i') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('A') }}
                </td>
                <td></td>
                <td style="width: 30%;" class="header-content-table">
                    Hora del Reporte
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('H') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('i') }}
                </td>
                <td class="cell text-center">
                    {{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('A') }}
                </td>
            </tr>
        </table>
    </section>
    <section class="datos_reporte mt-3">
        <table style="width: 100%;">
            <tr>
                <td style="width: 50%;" class="cell">
                    <strong>Reportado por:</strong>
                    <br>
                    {{ $reportability->reportado() }}
                </td>
                <td style="width: 50%;" class="cell text-center">
                    <img src="data:image/png;base64,{{ $reportability->firma }}" class="firma" alt="Firma">
                </td>
            </tr>
        </table>
        {{-- <table style="width: 100%; margin-top:-1.5px;">
            <tr>
                @foreach ($reportability->levels() as $key => $names)
                    @php
                        $key = ucfirst($key);
                        $key = str_replace('Taller_seccion', 'Taller/Sección', $key);
                    @endphp
                    <td style="width:33%;" class="cell">
                        <strong>{{ $key }}:</strong>
                        <br>
                        {{ $names }}
                    </td>
                @endforeach
            </tr>
        </table> --}}
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
            {{ ucfirst(strtolower($reportability->lugar ?? 'No especificado')) }}
        </div>
    </section>

    <section>
        <h4 class="mb-1">DESCRIPCIÓN DEL EVENTO</h4>
        <div style="min-height: 50px; width: 98.5%;" class="border text-justify">
            {{ $reportability->descripcion ?? 'No se ha proporcionado una descripción del evento.' }}
        </div>
    </section>

    <section>
        <h4 class="mb-1">ACCIONES CORRECTIVAS (Realizadas o sugeridas)</h4>
        <div style="min-height: 50px; width: 98.5%;" class="border text-justify">
            {{ $reportability->correctiva ?? 'No se han especificado acciones correctivas.' }}
        </div>
    </section>

    <section class="evaluacion">
        <h4 class="mb-1">NIVEL DE RIESGO</h4>
        <table style="width: 100%;">
            <tr>
                {{-- <td style="width: 10%; text-align: left;" class="cell">Nivel de Riesgo</td>
                <td style="width: 2%"></td> --}}
                <td style="width: 6%" class="cell">Alto</td>
                <td class="cell x-centered" style="width: 5%">{{ $reportability->gravedad == 'Alto' ? 'X' : '' }}</td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Medio</td>
                <td class="cell x-centered" style="width: 5%">{{ $reportability->gravedad == 'Medio' ? 'X' : '' }}</td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Bajo</td>
                <td class="cell x-centered" style="width: 5%">{{ $reportability->gravedad == 'Bajo' ? 'X' : '' }}</td>
            </tr>
            {{-- <tr>
                <td style="width: 10%; text-align: left;" class="cell">Probabilidad de ocurrencia</td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Alta</td>
                <td class="cell x-centered" style="width: 5%">{{ $reportability->probabilidad == 'Alta' ? 'X' : '' }}
                </td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Moderada</td>
                <td class="cell x-centered" style="width: 5%">
                    {{ $reportability->probabilidad == 'Moderada' ? 'X' : '' }}</td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Rara Vez</td>
                <td class="cell x-centered" style="width: 5%">{{ $reportability->probabilidad == 'Rara Vez' ? 'X' : '' }}</td>
            </tr>
            <tr>
                <td style="width: 10%; text-align: left;" class="cell">Nivel de exposición</td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Extensivo</td>
                <td class="cell x-centered" style="width: 5%">
                    {{ $reportability->exposicion == 'Extensivo' ? 'X' : '' }}</td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Moderado</td>
                <td class="cell x-centered" style="width: 5%">
                    {{ $reportability->exposicion == 'Moderado' ? 'X' : '' }}</td>
                <td style="width: 2%"></td>
                <td style="width: 6%" class="cell">Bajo</td>
                <td class="cell x-centered" style="width: 5%">{{ $reportability->exposicion == 'Bajo' ? 'X' : '' }}</td>
            </tr> --}}
        </table>
    </section>
    <section>

        <h4 class="mb-1">DE ACUERDO AL ANÁLISIS, LAS CAUSAS FUERON:</h4>
        @if ($reportability->categoryCompanyName() == 'Otros')
            <div style="width: 100%; border: 1px solid black; padding-left: 2px;">
                <p class="" style="padding-left: 5px;">Otros: {{ $reportability->otros }}</p>
            </div>
        @else
            <div style="width: 100%; border: 1px solid black; padding:2px;">
                {{ ucfirst(strtolower($reportability->categoryCompanyName())) }}
            </div>
        @endif
    </section>

    <section>
        <h4 class="negrita mb-1">INGENIEROS DE SEGURIDAD NOTIFICADOS:</h4>
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

    <section>
        <h4 class="mb-1">ANEXOS</h4>
        @php
            $images = $reportability->imagenes();
        @endphp

        @foreach ($images as $image)
            <div style="width: 100%; text-align: center;">
                <img src="data:image/png;base64,{{ $image['img'] }}" alt="{{ $key }}"
                    class="fixed-height-img">
            </div>
        @endforeach
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
                        <strong style="font-size: 1.2em; ">Reporte Finalizado</strong>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid">
                        <span style="font-size: 1em; ">Finalizado por: {{ $user->nomres }}
                            {{ $user->apellidos }}</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid">
                        <span style="font-size: 1em; ">Comentario: {{ $finalizado->comentario }}</span>
                    </td>
                </tr>
            </table>

            <strong
                style="font-size: 1.1em; color: black; margin-top: 20px; margin-bottom:20px; display: block;">ANEXOS:</strong>
            <table style="width: 100%; border-collapse: collapse;">
                @foreach ($fotos as $foto)
                    <tr style="margin-bottom: 10px;">
                        <td style="text-align: center; border: none;">
                            <img src="{{ $url . '/' . $foto }}" alt="Foto del reporte" class="fixed-height-img">
                        </td>
                    </tr>
                @endforeach
            </table>
        </section>
    @endif
</body>

</html>

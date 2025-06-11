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
            margin: 10px;
            padding: 0;
            font-size: 14px;
            line-height: 1.2;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 0;
        }

        .header {
            width: 100%;
            margin-bottom: 8px;
        }

        .header td {
            vertical-align: middle;
            padding: 2px;
        }

        .header img {
            max-width: 100px;
            height: auto;
        }

        .header .text {
            text-align: right;
            font-size: 12px;
            font-weight: bold;
        }

        .text-center {
            text-align: center;
        }

        h1 {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0 8px 0;
        }

        h4 {
            font-size: 14px;
            font-weight: bold;
            margin: 8px 0 3px 0;
        }

        .cell {
            border: 1px solid black;
            height: 25px;
            width: 25px;
            text-align: center;
            vertical-align: middle;
            font-size: 18px;
            font-weight: bold;
        }

        .data-cell {
            border: 1px solid black;
            padding: 4px 6px;
            vertical-align: top;
            font-size: 13px;
        }

        .fecha-cell {
            border: 1px solid black;
            width: 25px;
            height: 22px;
            text-align: center;
            vertical-align: middle;
            font-size: 13px;
            font-weight: bold;
        }

        .border {
            border: 1px solid black;
            padding: 6px;
            margin: 3px 0 8px 0;
            font-size: 13px;
            min-height: 80px;
        }

        .fixed-height-img {
            max-height: 200px;
            max-width: 100%;
            display: block;
            margin: 5px auto;
        }

        .footer {
            position: fixed;
            bottom: 5px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            font-style: italic;
        }

        .compact-section {
            margin: 8px 0;
        }

        .no-padding {
            padding: 0;
        }

        .small-text {
            font-size: 10px;
        }

        .finalized-table td {
            border: 1px solid black;
            padding: 6px;
            font-size: 13px;
        }

        .page-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            margin-bottom: 10px;
        }

        .content {
            margin-top: 70px;
        }
    </style>
</head>

<body>
    <div class="page-header">
        <table class="header">
            <tr>
                <td style="width: 70%;"><img src="{{ $logo }}" alt="Logo"></td>
                <td class="text">GPS-PG-18. F.01</td>
            </tr>
        </table>
    </div>

    <div class="footer" style="font-size: 11px; color: rgba(255, 0, 0, 0.7);">
        Un acto/condición subestándar reportado es un ACCIDENTE EVITADO
    </div>

    <div class="content">
        <h1 style="font-size: 30px; text-decoration: underline; text-align: center;">ESTOY REPORTANDO UN(A)</h1>
        <br><br>
        <section class="compact-section">
            <table>
                <tr>
                    <td style="width: 25%;"></td>
                    <td style="width: 15%; text-align: left; font-size: 14px; padding-left: 10px;">
                        Acto<br>subestándar
                    </td>
                    <td class="cell" style="width: 5%;">
                        {{ $reportability->tipo_reporte == 'actos' ? 'X' : '' }}
                    </td>
                    <td style="width: 5%;"></td>
                    <td style="width: 15%; text-align: left; font-size: 14px; padding-left: 10px;">
                        Condición<br>subestándar
                    </td>
                    <td class="cell" style="width: 5%;">
                        {{ $reportability->tipo_reporte == 'condiciones' ? 'X' : '' }}
                    </td>
                    <td style="width: 25%;"></td>
                </tr>
            </table>
        </section>
        <br>
        <section class="compact-section">
            <table>
                <tr>
                    <td style="width: 10%; padding-left: 10px; font-size: 14px;">Fecha del <br> Reporte</td>
                    <td class="fecha-cell">{{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('d') }}</td>
                    <td class="fecha-cell">{{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('m') }}</td>
                    <td class="fecha-cell" style="margin-left: 5px; padding: 5px;">
                        {{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('Y') }}</td>
                    <td style="width: 70%;"></td>
                </tr>
            </table>
        </section>
        <br>
        <section class="compact-section">
            <table style="margin-top: 5px;">
                <tr>
                    <td style="width: 25%;" class="data-cell">
                        <strong>Hora:</strong><br>{{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('H:i A') }}
                    </td>
                    <td style="width: 75%;" class="data-cell">
                        <strong>Lugar:</strong><br>{{ ucfirst(strtolower($reportability->lugar ?? 'No especificado')) }}
                    </td>
                </tr>
            </table>
            <table style="margin-top: -1px;">
                <tr>
                    <td class="data-cell">
                        <strong>Gerencia:</strong><br>
                        @foreach ($reportability->levels() as $key => $names)
                            @if ($key == 'gerencia')
                                {{ $names }}
                                @if (strtolower($names) == 'otros')
                                    ({{ $reportability->other_managements ?? 'No especificado' }})
                                @endif
                                @break
                            @endif
                        @endforeach
                    </td>
                </tr>
            </table>
            <table style="margin-top: -1px;">
                <tr>
                    <td style="width: 50%;" class="data-cell">
                        <strong>Reportado por:</strong><br>{{ $reportability->reportado() }}
                    </td>
                    <td style="width: 50%;" class="data-cell">
                        <strong>Registro/DNI:</strong><br>{{ $dni ?? '' }}
                    </td>
                </tr>
            </table>
        </section>

        <section class="compact-section">
            <h4>DESCRIPCIÓN DEL ACTO O CONDICIÓN</h4>
            <div class="border">
                {{ $reportability->descripcion ?? 'No se ha proporcionado una descripción del evento.' }}
            </div>
        </section>

        <section class="compact-section">
            <h4>ACCIONES CORRECTIVAS (Realizadas o sugeridas)</h4>
            <div class="border">
                {{ $reportability->correctiva ?? 'No se han especificado acciones correctivas.' }}
            </div>
        </section>

        <section class="compact-section">
            <h4>ARCHIVO FOTOGRÁFICO</h4>
            @php
                $images = $reportability->imagenes();
            @endphp

            @foreach ($images as $image)
                <img src="data:image/png;base64,{{ $image['img'] }}" alt="Imagen" class="fixed-height-img">
            @endforeach
        </section>
    </div>

    @php
        $finalizado = $reportability->moduleReview;
    @endphp

    @if ($finalizado)
        <div style="page-break-before: always;"></div>

        <div class="content">
            @php
                $user = $finalizado->user;
                $fotos = json_decode($finalizado->fotos);
            @endphp

            <h1 style="font-size: 24px; text-decoration: underline; text-align: center; margin-bottom: 20px;">REPORTE CERRADO
            </h1>

            <section class="compact-section">
                <table style="margin-top: 5px;">
                    <tr>
                        <td style="width: 50%;" class="data-cell">
                            <strong>Cerrado por:</strong><br>{{ $user->nombres }} {{ $user->apellidos }}
                        </td>
                        <td style="width: 50%;" class="data-cell">
                            <strong>Fecha de cierre:</strong><br>{{ \Carbon\Carbon::parse($finalizado->created_at)->setTimezone('America/Lima')->format('d/m/Y H:i A') }}
                        </td>
                    </tr>
                </table>
            </section>

            <section class="compact-section">
                <h4>COMENTARIOS DE CIERRE</h4>
                <div class="border">
                    {{ $finalizado->comentario ?? 'Sin comentarios adicionales.' }}
                </div>
            </section>

            <section class="compact-section">
                <h4>ANEXOS</h4>
                @if($fotos && count($fotos) > 0)
                    @foreach ($fotos as $foto)
                        @if (Str::endsWith($foto, ['.png', '.jpg', '.jpeg']))
                            <img src="{{ $url . '/' . $foto }}" alt="Anexo" class="fixed-height-img">
                        @else
                            <div style="margin: 3px 0;">
                                <a href="{{ url($foto) }}" target="_blank" style="color: blue; text-decoration: none;">
                                     {{ basename($foto) }}
                                </a>
                            </div>
                        @endif
                    @endforeach
                @else
                    <div class="border" style="min-height: 40px;">
                        No se adjuntaron anexos adicionales.
                    </div>
                @endif
            </section>
        </div>
    @endif
</body>

</html>

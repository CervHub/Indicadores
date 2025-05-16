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
            font-size: 12px; /* Reducir tamaño de letra */
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .header td {
            vertical-align: middle;
            text-align: center;
            padding: 5px;
            border: 1px solid black; /* Añadir bordes */
        }

        .header td:first-child {
            width: 20%; /* Primera columna: 20% */
        }

        .header td:nth-child(2) {
            width: 60%; /* Segunda columna: 60% */
        }

        .header td:last-child {
            width: 20%; /* Última columna: 20% */
        }

        .header img {
            max-width: 120px;
            height: auto;
        }

        .text-center {
            text-align: center;
        }

        .negrita {
            font-weight: bold;
            line-height: 0.7; /* Reducir interlineado */
        }

        .small-text {
            font-size: 10px; /* Reducir tamaño de letra */
            line-height: 0.4; /* Reducir interlineado */
        }

        .info-table td,
        .info-table th,
        .causes-table td,
        .causes-table th {
            border: 1px solid black; /* Bordes para las tablas */
            padding: 5px;
        }

        .info-table th,
        .causes-table th {
            text-align: center;
            font-weight: bold;
        }

        .info-table td:first-child {
            width: 20%;
        }

        .info-table td:nth-child(2) {
            width: 30%;
        }

        .info-table td:nth-child(3) {
            width: 20%;
        }

        .info-table td:nth-child(4) {
            width: 30%;
        }

        .causes-table td {
            text-align: center;
        }

        .observation {
            margin-top: 20px;
            width: 100%;
            border: 1px solid black;
            padding: 10px;
            min-height: 100px;
        }

        .signature {
            margin-top: 40px;
            text-align: center;
        }

        .signature-line {
            margin-top: 20px;
            display: inline-block;
            width: 200px;
            border-top: 1px solid black;
        }
    </style>
</head>

<body>
    <table class="header">
        <tr>
            <td><img src="{{ $logo }}" alt="Logo"></td>
            <td class="negrita">
                <p>REGISTRO</p>
                <p>INSPECCIÓN DE PRE-USO FLOTA LIVIANA Y</p>
                <p>SEMIPESADA</p>
            </td>
            <td class="small-text">
                <p>Código: SCJ-RE-106</p>
                <p>Versión: 00</p>
                <p>Fecha: 07/02/2023</p>
                <p>Página: 1 de 1</p>
            </td>
        </tr>
    </table>

    <table class="info-table" style="margin-top: 20px; width: 100%;">
        <tr>
            <td>Código del vehículo</td>
            <td></td>
            <td>Dpto / Sección</td>
            <td></td>
        </tr>
        <tr>
            <td>Fecha</td>
            <td></td>
            <td>Turno</td>
            <td></td>
        </tr>
        <tr>
            <td>Conductor</td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td>Kilometraje</td>
            <td></td>
            <td>Registro N</td>
            <td></td>
        </tr>
    </table>

    <table class="causes-table" style="margin-top: 20px; width: 100%;">
        <tr>
            <th rowspan="2">ÍTEM</th>
            <th colspan="3">ESTADO</th>
        </tr>
        <tr>
            <th>BIEN</th>
            <th>MAL</th>
            <th>NO APLICA</th>
        </tr>
        @php
            $causes = [
                ['id' => 1, 'name' => 'Nivel de aceite de motor', 'state' => 'Bien'],
                ['id' => 2, 'name' => 'Nivel de líquido de freno', 'state' => 'Mal'],
                ['id' => 3, 'name' => 'Nivel de agua de radiador', 'state' => 'No Aplica'],
                ['id' => 4, 'name' => 'Dirección', 'state' => 'Bien'],
                ['id' => 5, 'name' => 'Freno de servicio', 'state' => 'Mal'],
                // ...agregar más causas según sea necesario...
            ];
        @endphp
        @foreach ($causes as $cause)
        <tr>
            <td>{{ $cause['name'] }}</td>
            <td>@if ($cause['state'] === 'Bien') X @endif</td>
            <td>@if ($cause['state'] === 'Mal') X @endif</td>
            <td>@if ($cause['state'] === 'No Aplica') X @endif</td>
        </tr>
        @endforeach
    </table>

    <div class="observation">
        <strong>Observaciones:</strong>
        <p></p>
    </div>

    <div class="signature">
        <p>Firma</p>
        <div class="signature-line"></div>
    </div>
</body>

</html>

<!DOCTYPE html>
<html>

<head>
    <title>REPORTE DE : "{{ strtoupper($report) }}" [CERRADO] GESTIÓN SST</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }

        .header {
            background-color: #800020;
            color: white;
            padding: 10px 0;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .header img {
            height: 64px;
            width: auto;
            margin-bottom: 10px;
        }

        .content {
            padding: 20px;
            text-align: center;
        }

        .content p {
            line-height: 1.6;
            font-weight: bold;
            /* Added bold styling */
        }

        .button {
            display: inline-block;
            padding: 15px 25px;
            font-size: 16px;
            color: white !important;
            background-color: #800020;
            border-radius: 30px;
            text-decoration: none;
            margin-top: 20px;
        }

        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
        }

        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }

        .report-id {
            margin-top: 10px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            @if ($logoUrl)
                <img src="{{ $logoUrl }}" alt="LOGO">
            @else
                <p>LOGO NO DISPONIBLE</p>
            @endif
            <h1>REPORTE DE : "{{ strtoupper($report) }}" [CERRADO]</h1>
        </div>
        <div class="content">
            <p>SE HA CERRADO EL REPORTE DE : "{{ strtoupper($report) }}" EL DÍA DE {{ strtoupper($date) }}.</p>
            <p><strong>EMPRESA REPORTADA:</strong> {{ strtoupper($empresaReportada) }}</p>
            <p><strong>EMPRESA QUE REPORTA:</strong> {{ strtoupper($empresaQueReporta) }}</p>
            <p><strong>CERRADO POR:</strong> {{ strtoupper($generatedBy) }}</p>
            <div class="report-id">
                ID DEL REPORTE: {{ last(explode('/', $reportLink)) }}
            </div>
            @if ($module ?? false)
                <div class="module-details">
                    <p><strong>DETALLES DEL MÓDULO:</strong></p>
                    <p><strong>DESCRIPCIÓN:</strong> {{ strtoupper($module->descripcion ?? '-') }}</p>
                    <p><strong>ACCIÓN CORRECTIVA:</strong> {{ strtoupper($module->correctiva ?? '-') }}</p>
                    <p><strong>GRAVEDAD:</strong> {{ strtoupper($module->gravedad ?? '-') }}</p>
                    <p><strong>CAUSA:</strong> {{ strtoupper($module->categoryCompanyName() ?? '-') }}</p>
                </div>
            @endif
            <a href="{{ $reportLink }}" class="button">DESCARGAR REPORTE</a>
        </div>
        <div class="footer">
            <p>&COPY; {{ date('Y') }} GESTIÓN SST. POWERED BY <a href="https://cerv.com.pe/">CERV</a>. TODOS LOS
                DERECHOS RESERVADOS.</p>
        </div>
    </div>
</body>

</html>

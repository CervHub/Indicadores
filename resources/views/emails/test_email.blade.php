<!DOCTYPE html>
<html>

<head>
    <title>REPORTE DE : "{{ strtoupper($report) }}" [ABIERTO] GESTIÓN SST</title>
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
            <h1>REPORTE DE : "{{ strtoupper($report) }}" [ABIERTO]</h1>
        </div>
        <div class="content">
            <p>SE HA GENERADO UN REPORTE DE : "{{ strtoupper($report) }}" EL DÍA DE {{ strtoupper($date) }}.</p>
            <p><strong>EMPRESA REPORTADA:</strong> {{ strtoupper($empresaReportada) }}</p>
            <p><strong>EMPRESA QUE REPORTA:</strong> {{ strtoupper($empresaQueReporta) }}</p>
            <p><strong>GENERADO POR:</strong> {{ strtoupper($generatedBy) }}</p> <!-- Updated text -->
            <div class="report-id">
                ID DEL REPORTE: {{ last(explode('/', $reportLink)) }}
            </div>

            @if ($module)
                <div class="module-details">
                    <h3>DETALLES DEL MÓDULO</h3>
                    <div class="detail-item">
                        <span class="detail-label">DESCRIPCIÓN:</span>
                        {{ strtoupper($module->descripcion) }}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">CORRECTIVA:</span>
                        {{ strtoupper($module->correctiva) }}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">GRAVEDAD:</span>
                        {{ strtoupper($module->gravedad) }}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">CAUSA:</span>
                        {{ strtoupper($module->categoryCompanyName()) }}
                    </div>
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

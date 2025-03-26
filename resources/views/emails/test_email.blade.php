<!DOCTYPE html>
<html>

<head>
    <title>Reporte de : "{{ $report }}" Gestión SST</title>
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
            /* Rojo guinda */
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
            /* Centrar el contenido */
        }

        .content p {
            line-height: 1.6;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white !important;
            /* Letra negra */
            background-color: #800020;
            /* Azul */
            border-radius: 5px;
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
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            @if ($logoUrl)
                <img src="{{ $logoUrl }}" alt="Logo">
            @else
                <p>Logo no disponible</p>
            @endif
            <h1>Reporte de : "{{ $report }}"</h1>
        </div>
        <div class="content">
            <p>Se ha generado un reporte de : "{{ $report }}" el día de {{ $date }}.</p>
            <p>Gerencia reportada: {{ $management }}</p>
            <p>Generado por: {{ $generatedBy }}</p>
            <a href="{{ $reportLink }}" class="button">Descargar Reporte</a>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Gestión SST. Powered by <a href="https://cerv.com.pe/">CERV</a>. Todos los
                derechos reservados.</p>
        </div>
    </div>
</body>

</html>

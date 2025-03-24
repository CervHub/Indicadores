<!-- filepath: d:\Proyectos Web - Moises\Proyectos\2024_03_Proy_Indicadores\resources\views\app.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    {{-- Add the favicon link here --}}
    <link rel="icon" href="{{ asset('icons/spccw.png') }}" type="image/x-icon">

    {{-- Meta tags for SEO --}}
    <meta name="description"
        content="Aplicación para la gestión de actos, condiciones, incidentes e inspección creada por CERV">
    <meta name="keywords"
        content="SST, Grupo mexico,gestión de actos, condiciones, incidentes, inspección, seguridad, CERV">
    <meta name="author" content="CERV">
    <meta property="og:title" content="Gestión de Actos y Condiciones - CERV">
    <meta property="og:description"
        content="Aplicación para la gestión de actos, condiciones, incidentes e inspección creada por CERV">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="{{ asset('icons/spcc.png') }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@CERV">
    <meta name="twitter:title" content="Gestión de Actos y Condiciones - CERV">
    <meta name="twitter:description"
        content="Aplicación para la gestión de actos, condiciones, incidentes e inspección creada por CERV">
    <meta name="twitter:image" content="{{ asset('icons/spcc.png') }}">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>

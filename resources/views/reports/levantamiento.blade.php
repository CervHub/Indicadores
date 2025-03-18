@php
    $finalizado = $reportability->moduleReview;
    $user = $finalizado->user;
    $fotos = json_decode($finalizado->fotos);
@endphp

<section class="section">
    <div class="card">
        <div class="card-header">
            <h4 class="card-title">Reporte Finalizado</h4>
        </div>
        <div class="card-body">
            <p><strong>Finalizado por:</strong> {{ $user->nombres }} {{ $user->apellidos }}</p>
            <p><strong>Comentario:</strong> {{ $finalizado->comentario }}</p>
            <p><strong>Fecha de Finalización:</strong>
                {{ \Carbon\Carbon::parse($finalizado->created_at)->format('d/m/Y H:i:s') }}</p>
            <p><strong>Fotos:</strong></p>
            <div class="row">
                @foreach ($fotos as $foto)
                    <div class="col-md-3">
                        <img src="{{ asset($foto) }}" class="img-fluid img-thumbnail agrandar" alt="Foto" height="200px"
                            width="auto">
                    </div>
                @endforeach
            </div>
        </div>
    </div>


</section>

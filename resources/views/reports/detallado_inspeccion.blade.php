<section class="section" id="content">
    <div class="card">
        <div class="card-header">
            <h4 class="card-title">Detalles de la inspección</h4>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-md-6 form-group">
                    <label class="card-title">Inspeccinado por:</label>
                    <input type="text" class="form-control"
                        value="{{ $reportability->user->nombres }} {{ $reportability->user->apellidos }}" readonly>
                </div>
                <div class="col-md-6 form-group">
                    <label class="card-title">Empresa: </label>
                    <input type="text" class="form-control" value="{{ $reportability->user->company->nombre }}"
                        readonly>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 form-group">
                    @php
                        $tipoReporte = '';
                        switch ($reportability->tipo_reporte) {
                            case 'actos':
                                $tipoReporte = 'Reporte de actos subestándar';
                                break;
                            case 'condiciones':
                                $tipoReporte = 'Reporte de condiciones subestándar';
                                break;
                            case 'incidentes':
                                $tipoReporte = 'Reporte de incidentes';
                                break;
                            case 'inspeccion':
                                $tipoReporte = 'Reporte de inspección';
                                break;
                            default:
                                $tipoReporte = 'Estado desconocido';
                        }
                    @endphp

                    <label class="card-title">Tipo: </label>
                    <input type="text" class="form-control" value="{{ $tipoReporte }}" readonly>
                </div>
                <div class="col-md-6 form-group">
                    <label class="card-title">Estado: </label>
                    <input type="text" class="form-control" value="{{ $reportability->estado }}" readonly>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 form-group">
                    <label class="card-title">Fecha de inspección: </label>
                    <input type="text" class="form-control"
                        value="{{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('d-m-Y H:i:s') }}"
                        readonly>
                </div>
                <div class="col-md-6 form-group">
                    <label class="card-title">Tipo de inspección: </label>
                    <input type="text" class="form-control" value="{{ $reportability->tipo_inspeccion }}" readonly>
                </div>
            </div>

            {{-- <div class="row">
                @php
                    $levels = $reportability->levels();
                @endphp

                @foreach ($levels as $key => $value)
                    <div class="col-md-4 form-group">
                        @php
                            $key = str_replace('taller_seccion', 'Taller/Sección', $key);
                        @endphp
                        <label class="card-title">{{ ucfirst($key) }}: </label>
                        <input type="text" class="form-control" value="{{ $value }}" readonly>
                    </div>
                @endforeach
            </div> --}}
            <div class="row">
                @php
                    $levels = $reportability->levels();
                @endphp

                @foreach ($levels as $key => $value)
                    @if ($key == 'gerencia')
                        <div class="col-md-4 form-group">
                            @php
                                $key = str_replace('taller_seccion', 'Taller/Sección', $key);
                            @endphp
                            <label class="card-title">{{ ucfirst($key) }}: </label>
                            <input type="text" class="form-control" value="{{ $value }}" readonly>
                        </div>
                    @endif
                @endforeach
            </div>

            <div class="row">
                <div class="col-md-6 form-group">
                    <label for="" class="card-title">Lugar</label>
                    <input type="text" class="form-control" value="{{ ucfirst($reportability->lugar) }}">
                </div>


            </div>
            <div class="row">
                <div class="col-md-12 form-group">

                    <strong class="mb-3"><label>Los detalles de la inspección son:</label></strong>
                    @php
                        $details = $reportability->imagesPI();
                        if (is_null($details)) {
                            $details = []; // Asegura que $details sea un array, incluso si $reportability->details es null.
                        }
                    @endphp
                    <div class="row mt-3">
                        @foreach ($details as $detail)
                            <div class="col-md-4 mb-2">
                                <div class="card rounded bg-light text-dark">
                                    <div class="card-body">
                                        <h5 class="card-title">Tipo de detalle: {{ $detail['tipo_detalle'] }}</h5>
                                        <p class="card-text"><strong>Riesgo:</strong>
                                            {{ substr($detail['riesgo'], 3) }}</p>
                                        <p class="card-text"><strong>Observación:</strong> {{ $detail['observacion'] }}
                                        </p>
                                        <p class="card-text"><strong>Acción correctiva:</strong>
                                            {{ $detail['correctiva'] }}</p>
                                        <p class="card-text"><strong>Responsable:</strong>
                                            {{ $detail['nombre_responsable'] }}</p>
                                        <p class="card-text"><strong>Fecha de cumplimiento:</strong>
                                            {{ str_replace('/', '-', $detail['fecha_cumplimiento']) }}</p>
                                        <div><strong>Fotos:</strong></div>
                                        @if (isset($detail['fotos']) && is_array($detail['fotos']) && count($detail['fotos']) > 0)
                                            <div class="d-flex flex-wrap gap-3">
                                                @foreach ($detail['fotos'] as $foto)
                                                    @if (isset($foto['base64']))
                                                        <div style="flex: 0 1 auto; max-width: 200px;">
                                                            <img class="agrandar"
                                                                src="data:image/jpeg;base64,{{ trim($foto['base64']) }}"
                                                                style="width: 100%; max-height: 200px; object-fit: contain; border: 0.5px solid #e4e1e1; border-radius: 10px;">
                                                        </div>
                                                    @endif
                                                @endforeach
                                            </div>
                                        @else
                                            <p class="card-text">Sin fotos</p>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <div class="row">
                <label class="card-title">Se reporta a los ingenieros de seguridad: </label>
                <div class="col-md-4 form-group">
                    @php
                        $engineers = json_decode($reportability->send_email);
                    @endphp

                    @foreach ($engineers as $engineer)
                        <input type="text" class="form-control mb-1"
                            value="{{ $engineer->nombre }} {{ $engineer->apellidos }} - {{ $engineer->email }}"
                            readonly>
                    @endforeach
                </div>
            </div>
            <div class="row">
                {{-- <div class="col-md-6 form-group">
                    <label class="card-title">Comentario: </label>
                    <textarea class="form-control" style="height: 100px;" readonly>{{ $reportability->comentario }}</textarea>
                </div> --}}
                <div class="col-md-6 form-group">
                    <label class="card-title">Firma: </label>
                    <div
                        style="display: flex; justify-content: start; align-items: center; height: 100px; width:320px;">
                        <img src="data:image/png;base64,{{ $reportability->firma }}" class="img-fluid " alt="Firma"
                            style="width: 56.25%; height: 100%; border-radius:10px; border: 1px solid #e4e1e1;">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

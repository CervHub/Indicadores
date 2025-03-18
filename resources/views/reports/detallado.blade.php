<section class="section" id="content">
    <div class="card">
        <div class="card-header">
            <h4 class="card-title">Detalles del Reporte</h4>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6 form-group">
                    <label class="card-title">Fecha de reporte: </label>
                    <input type="text" class="form-control"
                        value="{{ \Carbon\Carbon::parse($reportability->fecha_reporte)->format('d-m-Y H:i:s') }}"
                        readonly>
                </div>
                <div class="col-md-6 form-group">
                    <label class="card-title">Fecha de evento: </label>
                    <input type="text" class="form-control"
                        value="{{ \Carbon\Carbon::parse($reportability->fecha_evento)->format('d-m-Y H:i:s') }}"
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
                <div class="col-md-12 form-group">
                    <label for="" class="card-title">Causa</label>
                    <input type="text" class="form-control" value="{{ $reportability->categoryCompanyName() }}">
                </div>

                @if ($reportability->categoryCompanyName() == 'Otros')
                    <div class="col-md-12 form-group">
                        <input type="text" class="form-control" value="{{ $reportability->otros }}">
                    </div>
                @endif
            </div>
            <div class="row">
                <div class="col-md-6 form-group">
                    <label for="" class="card-title">Lugar</label>
                    <input type="text" class="form-control" value="{{ ucfirst($reportability->lugar) }}">
                </div>
                <div class="col-md-6 form-group">
                    <label for="" class="card-title">Descripción del evento</label>
                    <input type="text" class="form-control" value="{{ ucfirst($reportability->descripcion) }}">
                </div>
                <div class="col-md-6 form-group">
                    <label for="" class="card-title">Acciones correctivas</label>
                    <input type="text" class="form-control" value="{{ ucfirst($reportability->correctiva) }}">
                </div>

            </div>
            {{-- <div class="row">
                <div class="col-md-4 form-group">
                    <label for="" class="card-title">Tipo de gravedad</label>
                    <input type="text" class="form-control" value="{{ ucfirst($reportability->gravedad) }}">
                </div>
                <div class="col-md-4 form-group">
                    <label for="" class="card-title">Tipo de probabilidad</label>
                    <input type="text" class="form-control" value="{{ ucfirst($reportability->probabilidad) }}">
                </div>
                <div class="col-md-4 form-group">
                    <label for="" class="card-title">Tipo de exposición</label>
                    <input type="text" class="form-control" value="{{ ucfirst($reportability->exposicion) }}">
                </div>
            </div> --}}
            <div class="row">
                <div class="col-md-12 form-group">
                    <label for="" class="card-title">De acuerdo al analisis, las causas fueron:</label>
                    <br>
                    <label for="">ANEXOS:</label>
                </div>
                @php
                    $images = $reportability->imagenes();
                @endphp

                <div class="d-flex flex-wrap gap-3">
                    @foreach ($images as $image)
                        <div class="form-group" style="flex: 0 1 auto; max-width: 430px;">
                            <img src="data:image/png;base64,{{ $image['img'] }}" class="img-fluid agrandar"
                                style="border: 0.5px solid #e4e1e1; border-radius: 10px; max-height: 200px; object-fit: contain;">
                            {{-- <p>{{$image['res']}}</p> --}}
                        </div>
                    @endforeach
                </div>
            </div>
            {{-- <div class="row">
                <div class="row">
                    @php
                        $levels2 = $reportability->levels2();
                    @endphp

                    @foreach ($levels2 as $key => $value)
                        <div class="col-md-4 form-group">
                            @php
                                $key = str_replace('_', ' ', $key);
                            @endphp
                            <label class="card-title">{{ ucfirst($key) }}: </label>
                            <input type="text" class="form-control" value="{{ $value }}" readonly>
                        </div>
                    @endforeach
                </div>
            </div> --}}
            @php
                $engineers = json_decode($reportability->send_email);
            @endphp

            <div class="row">
                <label class="card-title">Se reporta a los ingenieros de seguridad: </label>
                <div class="col-md-4 form-group">
                    @foreach ($engineers as $engineer)
                        <input type="text" class="form-control mb-1"
                            value="{{ $engineer->nombre }} {{ $engineer->apellidos }} - {{ $engineer->email }}"
                            readonly>
                    @endforeach
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 form-group">
                    <label class="card-title">Comentario: </label>
                    <textarea class="form-control" style="height: 100px;" readonly>{{ $reportability->comentario }}</textarea>
                </div>
                <div class="col-md-6 form-group">
                    <label class="card-title">Firma: </label>
                    <div
                        style="display: flex; justify-content: start; align-items: center; height: 100px; width:180px;">
                        <img src="data:image/png;base64,{{ $reportability->firma }}" class="img-fluid" alt="Firma"
                            style="width: 100%; height: 100%; border-radius:10px; border: 1px solid #e4e1e1;">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

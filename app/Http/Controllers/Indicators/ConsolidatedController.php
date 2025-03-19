<?php

namespace App\Http\Controllers\Indicators;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consolidated;
use Inertia\Inertia;
use App\Services\ConsolidationCreationService;
use App\Exports\AnnexExport;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\UtilService;

class ConsolidatedController extends Controller
{
    protected $consolidationCreationService;
    protected $utilService;

    public function __construct(ConsolidationCreationService $consolidationCreationService)
    {
        $this->consolidationCreationService = $consolidationCreationService;
        $this->utilService = new UtilService();
    }

    public function index()
    {
        $consolidateds = Consolidated::all();
        return Inertia::render('consolidated/index', [
            'consolidateds' => $consolidateds
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $this->consolidationCreationService->store($request);

            // Generar y guardar los archivos Excel en la carpeta 'public/consolidated'
            $filePaths = $this->saveExcelToPublic($data);

            $consolidated = Consolidated::updateOrCreate(
                [
                    'year' => $request['year'],
                    'month' => $request['month'],
                ],
                [
                    'user_id' => Auth::user()->id,
                    'is_closed' => false,
                    'file_accumulation' => $filePaths[0], // Guardar la ruta del tercer archivo generado
                    'file_concentrator' => $filePaths[1], // Guardar la ruta del primer archivo generado
                    'file_sx_ew' => $filePaths[2], // Guardar la ruta del segundo archivo generado
                ]
            );

            $mensaje = 'Consolidado creado con exito';
            if ($consolidated->wasRecentlyCreated) {
                $mensaje = 'Consolidado actualizado con exito';
            }

            if ($request->has('reconsolidated')) {
                $mensaje = 'Consolidado reconsolidado con exito';
            }

            return redirect()->route('consolidated.index')->with('success', $mensaje);
        } catch (\Exception $e) {
            return redirect()->route('consolidated.index')->with('error', 'Error al crear o actualizar el consolidado: ' . $e->getMessage());
        }
    }

    private function saveExcelToPublic($data)
    {
        // Generar los archivos Excel
        $export = new AnnexExport($data);

        // Modificar y guardar los archivos Excel
        return $export->modifyAndSave();
    }

    public function download($id)
    {
        $consolidated = Consolidated::find($id);

        $files = [
            $consolidated->file_sx_ew,
            $consolidated->file_accumulation,
            $consolidated->file_concentrator
        ];

        $zipPath = $this->utilService->compressFiles($files);

        // Descargar el archivo ZIP
        return response()->download($zipPath);
    }

    public function close($id)
    {
        $consolidated = Consolidated::find($id);
        $consolidated->is_closed = 1;
        $consolidated->save();

        return redirect()->route('consolidated.index')->with('success', 'Consolidado cerrado correctamente' . $consolidated->id);
    }

    public function open($id)
    {
        $consolidated = Consolidated::find($id);
        $consolidated->is_closed = 0;
        $consolidated->save();

        return redirect()->route('consolidated.index')->with('success', 'Consolidado abierto correctamente' . $consolidated->id);
    }
}

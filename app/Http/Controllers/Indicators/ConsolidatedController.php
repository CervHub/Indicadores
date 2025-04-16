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
use App\Models\Company;
use App\Models\CompanyConsolidated;
use App\Models\ContractorCompany;
use App\Models\FileStatus;
use App\Models\Uea;
use App\Models\ContractorCompanyType;

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

    public function show($id)
    {
        $consolidated = Consolidated::find($id);
        $fileStatuses = FileStatus::where('year', $consolidated->year)
            ->where('month', $consolidated->month)
            ->where('is_old', false)
            ->with([
                'annex24',
                'annex25',
                'annex26',
                'annex27',
                'annex28',
                'annex30',
                'minemTemplate1',
                'minemTemplate2',
                'company',
                'contractorCompanyType',
                'uea'
            ])->get();
        $ueas = Uea::all();
        $companyConsolidateds = CompanyConsolidated::where('consolidated_id', $id)->with('company')->get();
        $contractorCompanyTypes = ContractorCompanyType::all();
        return Inertia::render('consolidated/show', [
            'consolidated' => $consolidated,
            'fileStatuses' => $fileStatuses,
            'ueas' => $ueas,
            'contractorCompanyTypes' => $contractorCompanyTypes,
            'companyConsolidateds' => $companyConsolidateds
        ]);
    }

    public function store(Request $request)
    {
        try {

            // Verificar si el consolidado ya existe y está cerrado
            $existingConsolidated = Consolidated::where('year', $request['year'])
                ->where('month', $request['month'])
                ->first();

            if ($existingConsolidated && $existingConsolidated->is_closed) {
                return redirect()->route('consolidated.index')->with('error', 'El consolidado ya existe y está cerrado.');
            }

            $data = $this->consolidationCreationService->store($request);

            // Generar y guardar los archivos Excel en la carpeta 'public/consolidated'
            $filePaths = $this->saveExcelToPublic($data, $request['year'], $request['month']);
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

            $this->registerCompanyConsolidated($consolidated->id);

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

    private function registerCompanyConsolidated($consolidated_id)
    {
        $companies = Company::where('estado', 1)->get();
        foreach ($companies as $company) {
            CompanyConsolidated::updateOrCreate(
                [
                    'company_id' => $company->id,
                    'consolidated_id' => $consolidated_id
                ],
                [
                    'company_id' => $company->id,
                    'consolidated_id' => $consolidated_id
                ]
            );
        }
    }

    private function saveExcelToPublic($data, $year, $month)
    {
        // Generar los archivos Excel
        $export = new AnnexExport($data, $year, $month);

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

    public function deleteCompany(Request $request, $id)
    {
        $companyConsolidated = CompanyConsolidated::where('company_id', $id)->where('consolidated_id', $request->consolidated_id)->first();

        $companyConsolidated->delete();

        return redirect()->back()->with('success', 'Empresa eliminada del consolidado correctamente');
    }

    public function updateFormatContract(Request $request)
    {
        // Validar que el archivo y la UEA estén presentes
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:2048', // Validar que sea un archivo Excel y limitar el tamaño
            'uea' => 'required|string|in:ACUMULACION,CONCENTRADORA,LIXIVIACION', // Validar que la UEA sea válida
        ]);

        // Obtener el archivo y la UEA del request
        $file = $request->file('file');
        $uea = $request->input('uea');

        // Mapear los valores de UEA a los nuevos códigos
        $ueaCode = match ($uea) {
            'ACUMULACION' => 'SPCAT',
            'CONCENTRADORA' => 'SPCCT',
            'LIXIVIACION' => 'SPCLX',
            default => null,
        };

        if (!$ueaCode) {
            return redirect()->back()->with('error', 'Código de UEA no válido.');
        }

        // Buscar el registro de la UEA en la base de datos
        $ueaModel = Uea::where('code', $ueaCode)->first();
        if (!$ueaModel) {
            return redirect()->back()->with('error', 'UEA no encontrada en la base de datos.');
        }

        // Definir la ruta y generar un nombre único para el archivo
        $destinationPath = public_path('formats');
        $uniqueFileName = "{$ueaCode}_" . uniqid() . ".xlsx";
        $relativeFilePath = "formats/{$uniqueFileName}"; // Ruta relativa
        $absoluteFilePath = "{$destinationPath}/{$uniqueFileName}";

        // Eliminar el archivo anterior si existe
        if ($ueaModel->description && file_exists(public_path($ueaModel->description))) {
            unlink(public_path($ueaModel->description));
        }

        // Mover el archivo a la carpeta 'public/formats' con el nuevo nombre
        $file->move($destinationPath, $uniqueFileName);

        // Actualizar la descripción en la base de datos con la ruta relativa
        $ueaModel->description = $relativeFilePath;
        $ueaModel->save();

        // Retornar una respuesta de éxito
        return redirect()->back()->with('success', "Formato de contrato para {$uea} actualizado correctamente y guardado en: {$relativeFilePath}");
    }

    public function downloadFormat($code)
    {
        $uea = Uea::where('code', $code)->first();

        if ($uea && $uea->description) {
            $filePath = public_path($uea->description);

            if (file_exists($filePath)) {
                return response()->download($filePath);
            }

            return response()->json(['error' => 'El archivo no existe en el servidor.'], 404);
        }

        return response()->json(['error' => 'Formato no encontrado.'], 404);
    }
}

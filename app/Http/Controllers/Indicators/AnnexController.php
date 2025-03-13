<?php

namespace App\Http\Controllers\Indicators;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Uea;
use App\Models\ContractorCompanyType;
use App\Models\FileStatus;
use App\Services\AttachmentAnalyzerService;
use Illuminate\Support\Facades\Auth;

class AnnexController extends Controller
{
    protected $attachmentAnalyzerService;
    protected $uea;
    protected $contractorCompanyType;
    protected $fileStatus;

    public function __construct(
        AttachmentAnalyzerService $attachmentAnalyzerService,
        Uea $uea,
        ContractorCompanyType $contractorCompanyType,
        FileStatus $fileStatus
    ) {
        $this->attachmentAnalyzerService = $attachmentAnalyzerService;
        $this->uea = $uea;
        $this->contractorCompanyType = $contractorCompanyType;
        $this->fileStatus = $fileStatus;
    }

    public function index()
    {
        $ueas = $this->uea->all();
        $contractorCompanyTypes = $this->contractorCompanyType->all();
        $fileStatuses = $this->fileStatus->where('is_old', false)
            ->where('user_id', Auth::id())
            ->where('contractor_company_id', Auth::user()->contractor_company_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('annexe/index', [
            'fileStatuses' => $fileStatuses,
            'ueas' => $ueas,
            'contractorCompanyTypes' => $contractorCompanyTypes,
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'user_id' => Auth::id(),
            'contractor_company_id' => Auth::user()->contractor_company_id,
        ]);

        $validatedData = $request->validate([
            'contractor_company_type_id' => 'required|exists:contractor_company_types,id',
            'uea_id' => 'required|exists:ueas,id',
            'year' => 'required',
            'month' => 'required',
            'file' => 'required|file',
            'user_id' => 'required',
            'contractor_company_id' => 'required',
        ], [
            'contractor_company_type_id.required' => 'El campo tipo de empresa contratista es obligatorio.',
            'contractor_company_type_id.exists' => 'El tipo de empresa contratista seleccionado no es válido.',
            'uea_id.required' => 'El campo UEA es obligatorio.',
            'uea_id.exists' => 'La UEA seleccionada no es válida.',
            'year.required' => 'El campo año es obligatorio.',
            'month.required' => 'El campo mes es obligatorio.',
            'file.required' => 'El campo archivo es obligatorio.',
            'file.file' => 'El campo archivo debe ser un archivo válido.',
        ]);

        try {
            $this->attachmentAnalyzerService->saveAnexo($validatedData);
            return redirect()->back()->with('success', 'Anexo guardado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al procesar: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $fileStatus = $this->fileStatus->with([
            'annex24',
            'annex25',
            'annex26',
            'annex27',
            'annex28',
            'annex30',
            'minemTemplate1',
            'minemTemplate2'
        ])->find($id);

        $ueas = $this->uea->all();
        $contractorCompanyTypes = $this->contractorCompanyType->all();

        return Inertia::render('annexe/show', [
            'fileStatus' => $fileStatus,
            'ueas' => $ueas,
            'contractorCompanyTypes' => $contractorCompanyTypes,
        ]);
    }
}

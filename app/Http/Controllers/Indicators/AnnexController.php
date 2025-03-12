<?php

namespace App\Http\Controllers\Indicators;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Uea;
use App\Models\Annex24;
use App\Models\Annex25;
use App\Models\Annex26;
use App\Models\Annex27;
use App\Models\Annex28;
use App\Models\ContractorCompanyType;
use App\Services\AttachmentAnalyzerService;

class AnnexController extends Controller
{
    protected $attachmentAnalyzerService;

    public function __construct(AttachmentAnalyzerService $attachmentAnalyzerService)
    {
        $this->attachmentAnalyzerService = $attachmentAnalyzerService;
    }

    public function index()
    {
        $annex24 = Annex24::all();
        $annex25 = Annex25::all();
        $annex26 = Annex26::all();
        $annex27 = Annex27::all();
        $annex28 = Annex28::all();
        $ueas = Uea::all();
        $contractorCompanyTypes = ContractorCompanyType::all();

        return Inertia::render(
            'annexe/index',
            [
                'annex24' => $annex24,
                'annex25' => $annex25,
                'annex26' => $annex26,
                'annex27' => $annex27,
                'annex28' => $annex28,
                'ueas' => $ueas,
                'contractorCompanyTypes' => $contractorCompanyTypes,
            ]
        );
    }

    public function store(Request $request)
    {
        $this->attachmentAnalyzerService->saveAnexo($request->all());
        return redirect()->route('annex.index');
    }
}

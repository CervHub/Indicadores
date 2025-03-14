<?php

namespace App\Http\Controllers\Indicators;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consolidated;
use Inertia\Inertia;
use App\Services\ConsolidationCreationService;

class ConsolidatedController extends Controller
{

    protected $consolidationCreationService;

    public function __construct(ConsolidationCreationService $consolidationCreationService)
    {
        $this->consolidationCreationService = $consolidationCreationService;
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
        $this->consolidationCreationService->store($request);
    }
}

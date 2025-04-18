<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Entity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ManagementController extends Controller
{
    public function index(): Response
    {
        $companyId = 1;
        $entities = Entity::where('company_id', $companyId)
            ->where('nivel', 1)
            ->get();
        return Inertia::render('management', [
            'entities' => $entities,
        ]);
    }
}

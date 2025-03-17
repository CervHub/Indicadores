<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Entity;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use App\Models\Level;
use App\Models\User;
class ManagementController extends Controller
{
    public function index(): View
    {
        // Aquí puedes usar $nivel y $entity
        $nivel = optional(Auth::user()->company->setting)->num_niveles ?? 0;
        $niveles = Level::where('company_id', Auth::user()->company->id)->get();
        $primerNivel = Level::where('company_id', Auth::user()->company->id)->where('orden', 1)->first();
        $users = User::where('company_id', Auth::user()->company->id)->get();
        $entities = Entity::where('company_id', Auth::user()->company->id)
            ->where('nivel', 1)
            ->get();
        return view('company.management.index', compact('nivel', 'users','niveles', 'primerNivel', 'entities'));
    }
}

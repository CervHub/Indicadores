<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Models\Level;
use Illuminate\Support\Facades\Auth;

class LevelController extends Controller
{
    public function store(Request $request)
    {
        try {
            $company = Auth::user()->company;
            $level = new Level();
            $level->nombre = $request->nombre;

            // Obtén el último orden de los niveles para la empresa y súmale uno
            $lastOrder = Level::where('company_id', $company->id)->max('orden');
            $level->orden = $lastOrder ? $lastOrder + 1 : 1;

            $level->company_id = $company->id;
            $level->save();

            return redirect()->back()->with('success', 'Nivel creado con éxito');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al crear el nivel: ' . $e->getMessage());
        }
    }
}

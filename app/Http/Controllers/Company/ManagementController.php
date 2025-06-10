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
        return Inertia::render('management/index', [
            'entities' => $entities,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        // Check for duplicates
        $exists = Entity::where('company_id', 1)
            ->where('nombre', $request->nombre)
            ->where('nivel', 1)
            ->exists();

        if ($exists) {
            return back()->withErrors(['nombre' => 'Ya existe una Gerencia con este nombre.']);
        }

        Entity::create([
            'nombre' => $request->nombre,
            'company_id' => 1,
            'nivel' => 1,
            'estado' => 1
        ]);

        return redirect()->back()->with('success', 'Gerencia creada exitosamente.');
    }

    public function update(Request $request, Entity $entity)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'estado' => 'required|in:0,1'
        ]);

        // Check for duplicates (excluding current entity)
        $exists = Entity::where('company_id', 1)
            ->where('nombre', $request->nombre)
            ->where('nivel', 1)
            ->where('id', '!=', $entity->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['nombre' => 'Ya existe una Gerencia con este nombre.']);
        }

        $entity->update([
            'nombre' => $request->nombre,
            'estado' => $request->estado
        ]);

        return redirect()->back()->with('success', 'Gerencia actualizada exitosamente.');
    }
}

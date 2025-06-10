<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\User;
use App\Models\Company;
use Inertia\Inertia;
use App\Models\Role;
use Illuminate\Support\Facades\Redirect;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Assignment::with(['user', 'company'])->get();
        $role = Role::where('code', 'IS')->first();

        $users = User::where('estado', true)
            ->where('role_id', $role->id)
            ->where('company_id', 1)
            ->select('id', 'nombres', 'apellidos', 'doi')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'nombre_completo' => $user->nombres . ' ' . $user->apellidos,
                    'doi' => $user->doi
                ];
            });

        $companies = Company::where('estado', true)
            ->select('id', 'nombre')
            ->get();

        return Inertia::render('assignment/index', [
            'assignments' => $assignments,
            'users' => $users,
            'companies' => $companies
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_id' => 'required|exists:companies,id',
        ]);

        // Buscar si ya existe la combinación
        $existingAssignment = Assignment::where('user_id', $request->user_id)
            ->where('company_id', $request->company_id)
            ->first();

        if ($existingAssignment) {
            // Si existe, actualizar
            $existingAssignment->update($request->all());
            return Redirect::route('assignments.index')->with('success', 'Asignación actualizada exitosamente.');
        } else {
            // Si no existe, crear
            Assignment::create($request->all());
            return Redirect::route('assignments.index')->with('success', 'Asignación creada exitosamente.');
        }
    }

    public function update(Request $request, Assignment $assignment)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_id' => 'required|exists:companies,id',
        ]);

        $assignment->update($request->all());

        return Redirect::route('assignments.index')->with('success', 'Asignación actualizada exitosamente.');
    }

    public function destroy(Assignment $assignment)
    {
        $userName = $assignment->user ? $assignment->user->nombres . ' ' . $assignment->user->apellidos : 'Usuario';
        $companyName = $assignment->company ? $assignment->company->nombre : 'Empresa';
        
        $assignment->delete();

        return Redirect::route('assignments.index')->with('success', "Asignación de {$userName} a {$companyName} eliminada exitosamente.");
    }
}

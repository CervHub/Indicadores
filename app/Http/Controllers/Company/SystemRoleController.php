<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SystemRole;
use App\Models\Level;
use Illuminate\Support\Facades\Auth;

class SystemRoleController extends Controller
{
    public function index()
    {
        $systemRoles = SystemRole::all();
        $levels = Level::all();
        return view('company.system-role.index', compact('systemRoles', 'levels'));
    }

    public function store(Request $request)
    {
        try {
            $systemRole = new SystemRole();

            // Verifica si el campo 'permisos' existe en la solicitud
            if ($request->has('permisos')) {
                // Convierte el campo 'permisos' en un JSON
                $permisos = json_encode($request->input('permisos'));

                // Guarda el JSON en el campo 'permisos' del rol del sistema
                $systemRole->permisos = $permisos;
            }
            $systemRole->nombre = $request->input('nombre');
            $systemRole->descripcion = $request->input('descripcion');
            $systemRole->level_id = $request->input('level_id');
            $systemRole->company_id = Auth::user()->company->id;
            // Guarda el rol del sistema
            $systemRole->save();

            // Redirige al usuario a la página de roles del sistema con un mensaje de éxito
            return redirect()->back()->with('success', 'Rol del sistema creado con éxito.');
        } catch (\Exception $e) {
            // Redirige al usuario a la página de roles del sistema con un mensaje de error
            return redirect()->back()->with('error', 'Hubo un error al crear el rol del sistema: ' . $e->getMessage());
        }
    }
}

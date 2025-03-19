<?php

namespace App\Http\Controllers\Contrata;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PersonalController extends Controller
{
    public function index()
    {
        $rol_id = Role::where('nombre', 'Regular User')->first()->id;
        $company_id = Auth::user()->company_id;
        $people = User::where('role_id', $rol_id)
            ->where('company_id', $company_id)
            ->get();
        return Inertia::render('people/index', [
            'people' => $people
        ]);
    }

    public function store(Request $request)
    {
        // Eliminar la línea de depuración
        // dd($request->all());

        // Validar los campos
        $request->validate([
            'doi' => 'required|unique:users,doi',
            'email' => 'required|email|unique:users,email',
            'nombres' => 'required',
            'apellidos' => 'required',
            'telefono' => 'required',
            'cargo' => 'required',
        ]);

        try {
            // Verificar si ya existe un usuario con el mismo email o DOI
            $existingUser = User::where('email', $request->email)
                ->orWhere('doi', $request->doi)
                ->first();

            if ($existingUser) {
                return redirect()->back()->with('error', 'El usuario ya existe con el mismo email o DOI.');
            }

            // Crear un nuevo usuario
            $user = new User();
            $user->fill([
                'doi' => $request->doi,
                'nombres' => $request->nombres,
                'apellidos' => $request->apellidos,
                'password' => bcrypt($request->doi),
                'telefono' => $request->telefono,
                'email' => $request->email,
                'cargo' => $request->cargo,
                'company_id' => Auth::user()->company_id,
                'role_id' => Role::where('nombre', 'Regular User')->first()->id,
            ]);

            $user->save();

            return redirect()->back()->with('success', 'Usuario creado con éxito.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al crear el usuario: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Eliminar la línea de depuración
            // dd($request->all(), $id);

            $request->validate([
                'doi' => 'required|unique:users,doi,' . $id,
                'email' => 'required|email|unique:users,email,' . $id,
                'nombres' => 'required',
                'apellidos' => 'required',
                'telefono' => 'required',
                'cargo' => 'required',
            ]);

            $person = User::findOrFail($id);
            $person->doi = $request->doi;
            $person->email = $request->email;
            $person->nombres = $request->nombres;
            $person->apellidos = $request->apellidos;
            $person->telefono = $request->telefono;
            $person->cargo = $request->cargo;
            $person->save();

            return redirect()->route('contrata.personal')->with('success', 'Personal actualizado correctamente');
        } catch (\Exception $e) {
            return redirect()->route('contrata.personal')->with('error', 'Hubo un error al actualizar el usuario: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $person = User::findOrFail($id);
            $person->estado = !$person->estado; // Toggle the estado
            $person->save();

            $message = $person->estado ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente';
            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al cambiar el estado del usuario: ' . $e->getMessage());
        }
    }

    public function activate($id)
    {
        try {
            $person = User::findOrFail($id);
            $person->estado = !$person->estado; // Toggle the estado
            $person->save();

            $message = $person->estado ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente';
            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al cambiar el estado del usuario: ' . $e->getMessage());
        }
    }
}

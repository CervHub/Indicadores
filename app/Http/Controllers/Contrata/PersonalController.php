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
        // Validar los campos con mensajes personalizados
        $request->validate([
            'doi' => 'required|unique:users,doi',
            'nombres' => 'required',
            'apellidos' => 'required',
        ], [
            'doi.required' => 'El campo DNI es obligatorio.',
            'doi.unique' => 'El DNI ya está registrado.',
            'nombres.required' => 'El campo nombres es obligatorio.',
            'apellidos.required' => 'El campo apellidos es obligatorio.',
        ]);

        try {
            // Crear un nuevo usuario
            $user = new User();
            $user->fill([
                'doi' => $request->doi,
                'nombres' => $request->nombres,
                'apellidos' => $request->apellidos,
                'password' => bcrypt($request->doi),
                'telefono' => $request->telefono,
                'email' => $request->email, // Opcional
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
            // Validar los campos con mensajes personalizados
            $request->validate([
                'doi' => 'required|unique:users,doi,' . $id,
                'nombres' => 'required',
                'apellidos' => 'required',
            ], [
                'doi.required' => 'El campo DNI es obligatorio.',
                'doi.unique' => 'El DNI ya está registrado.',
                'nombres.required' => 'El campo nombres es obligatorio.',
                'apellidos.required' => 'El campo apellidos es obligatorio.',
            ]);

            $person = User::findOrFail($id);
            $person->doi = $request->doi;
            $person->email = $request->email; // Opcional
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
            $person->estado = !$person->estado; // Alternar el estado
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
            $person->estado = !$person->estado; // Alternar el estado
            $person->save();

            $message = $person->estado ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente';
            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al cambiar el estado del usuario: ' . $e->getMessage());
        }
    }

    public function resetPassword($id)
    {
        try {
            $person = User::findOrFail($id);
            $person->password = bcrypt($person->doi);
            $person->save();

            return redirect()->back()->with('success', 'Contraseña restablecida correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al restablecer la contraseña: ' . $e->getMessage());
        }
    }
}

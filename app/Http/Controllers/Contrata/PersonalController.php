<?php

namespace App\Http\Controllers\Contrata;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\RoleUser;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PersonalController extends Controller
{


    public function index()
    {
        $excludedRoles = Role::whereIn('code', ['SA', 'CA'])->pluck('id');
        $roles = Role::whereNotIn('code', ['SA', 'CA'])->get();
        $company_id = Auth::user()->company_id;


        if ($company_id !== '1') {

            $roles = Role::whereIn('code', ['RU', 'IS'])->get();
        }

        $people = User::whereNotIn('role_id', $excludedRoles)
            ->where('company_id', $company_id)
            ->with('role') // Eager load the role relationship
            ->get();

        return Inertia::render('people/index', [
            'people' => $people,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        // Validar los campos con mensajes personalizados
        $request->validate([
            'doi' => 'required|unique:users,doi',
            'nombres' => 'required',
            'apellidos' => 'required',
            'role_id' => 'required|exists:roles,id',
        ], [
            'doi.required' => 'El campo DNI es obligatorio.',
            'doi.unique' => 'El DNI ya está registrado.',
            'nombres.required' => 'El campo nombres es obligatorio.',
            'apellidos.required' => 'El campo apellidos es obligatorio.',
            'role_id.required' => 'Debe seleccionar un rol.',
            'role_id.exists' => 'El rol seleccionado no es válido.',
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
                'role_id' => $request->role_id, // Mantener compatibilidad
            ]);

            $user->save();

            // Crear o actualizar el registro en role_users
            // Con restricción de un solo rol por usuario
            RoleUser::updateOrCreate(
                ['user_id' => $user->id], // Buscar por user_id
                ['role_id' => $request->role_id] // Actualizar o crear con el nuevo role_id
            );

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
                'role_id' => 'required|exists:roles,id',
            ], [
                'doi.required' => 'El campo DNI es obligatorio.',
                'doi.unique' => 'El DNI ya está registrado.',
                'nombres.required' => 'El campo nombres es obligatorio.',
                'apellidos.required' => 'El campo apellidos es obligatorio.',
                'role_id.required' => 'Debe seleccionar un rol.',
                'role_id.exists' => 'El rol seleccionado no es válido.',
            ]);

            $person = User::findOrFail($id);
            $person->doi = $request->doi;
            $person->email = $request->email; // Opcional
            $person->nombres = $request->nombres;
            $person->apellidos = $request->apellidos;
            $person->telefono = $request->telefono;
            $person->cargo = $request->cargo;
            $person->role_id = $request->role_id; // Actualizar el rol en la tabla users
            $person->save();

            // Actualizar o crear el registro en role_users
            // Con restricción de un solo rol por usuario
            RoleUser::updateOrCreate(
                ['user_id' => $id], // Buscar por user_id
                ['role_id' => $request->role_id] // Actualizar o crear con el nuevo role_id
            );

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

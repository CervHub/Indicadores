<?php

namespace App\Http\Controllers\Contrata;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\User;
use App\Models\RoleUser;
use App\Models\SecurityEngineer;
use Illuminate\Support\Facades\DB; // Import DB facade

class RoleController extends Controller
{
    public function index()
    {
        $excludedCodes = ['SA', 'CA', 'RU']; // Exclude roles with these codes
        $roles = Role::whereNotIn('code', $excludedCodes)->get(); // Filter roles by code

        $security_engineers = SecurityEngineer::where('company_id', auth()->user()->company_id)->get();
        $role_users = RoleUser::all();

        $ignoredUserIds = $role_users->pluck('user_id')->toArray();
        $ignoredUserIds = array_merge($ignoredUserIds, $security_engineers->pluck('user_id')->toArray());
        $users = User::where('company_id', auth()->user()->company_id)
            ->whereNotIn('id', $ignoredUserIds)
            ->where('estado', 1)
            ->where('role_id', 2)
            ->get();

        $roleUsers = DB::table('role_users')
            ->join('users', 'role_users.user_id', '=', 'users.id')
            ->join('roles', 'role_users.role_id', '=', 'roles.id')
            ->select(
                'role_users.user_id',
                'role_users.role_id',
                DB::raw("CONCAT(users.nombres, ' ', users.apellidos) as user_name"), // Concatenate nombres and apellidos
                'users.doi', // Include DOI of the user
                'roles.nombre as role_name',
                'role_users.created_at', // Include creation date
                'role_users.updated_at' // Include updated date
            )
            ->get();

        return inertia('roles/index', [
            'roles' => $roles,
            'users' => $users,
            'roleUsers' => $roleUsers, // Include role-user data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|exists:users,id',
            'roleId' => 'required|exists:roles,id',
        ]);

        try {
            // Use createOrUpdate logic to ensure a user has only one role
            RoleUser::updateOrCreate(
                ['user_id' => $validated['userId']], // Match by user_id
                ['role_id' => $validated['roleId']] // Update or create with role_id
            );

            // Update the user's general role_id
            $user = User::findOrFail($validated['userId']);
            $user->update(['role_id' => $validated['roleId']]);

            return redirect()->back()->with('success', 'Rol asignado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocurrió un error al asignar el rol: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'roleId' => 'required|exists:roles,id',
            ]);

            $roleUser = RoleUser::where('user_id', $id)->firstOrFail();
            $roleUser->update(['role_id' => $validated['roleId']]);

            // Update the user's general role_id
            $user = User::findOrFail($id);
            $user->update(['role_id' => $validated['roleId']]);

            return redirect()->back()->with('success', 'Rol actualizado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocurrió un error al actualizar el rol: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $roleUser = RoleUser::where('user_id', $id)->firstOrFail();
            $roleUser->delete();

            // Find the role with code 'RU' and assign it to the user
            $ruRole = Role::where('code', 'RU')->firstOrFail();
            $user = User::findOrFail($id);
            $user->update(['role_id' => $ruRole->id]);

            return redirect()->back()->with('success', 'Rol eliminado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocurrió un error al eliminar el rol: ' . $e->getMessage());
        }
    }
}

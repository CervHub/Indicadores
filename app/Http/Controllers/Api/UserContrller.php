<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class UserContrller extends Controller
{
    public function getUserCompany(Request $request, $company_id)
    {
        try {
            $ruRole = Role::where('code', 'RU')->first();

            if (!$ruRole) {
                return response()->json(['status' => false, 'message' => 'Rol de Usuario Regular no encontrado'], 404);
            }

            $users = User::where('company_id', $company_id)
                ->where('role_id', '=', $ruRole->id)
                ->select('id', 'nombres', 'apellidos', 'cargo', 'doi')
                ->get();

            return response()->json(['status' => true, 'data' => $users], 200);
        } catch (\Exception $e) {
            // Log the error or handle it as needed
            // Include the exception message in the response for more detail
            return response()->json(['status' => false, 'message' => 'Ocurrió un error en el servidor: ', 'error' => $e->getMessage()], 500);
        }
    }

    public function getUserCompanyIngSecurity(Request $request, $company_id)
    {
        try {
            $isRole = Role::where('code', 'IS')->first();

            if (!$isRole) {
                return response()->json(['status' => false, 'message' => 'Rol de Ingeniero de Seguridad no encontrado'], 404);
            }

            $users = User::where('company_id', $company_id)
                ->where('role_id', '=', $isRole->id)
                ->select('id', 'nombres', 'apellidos', 'cargo', 'doi')
                ->get();

            return response()->json(['status' => true, 'data' => $users], 200);
        } catch (\Exception $e) {
            // Log the error or handle it as needed
            // Include the exception message in the response for more detail
            return response()->json(['status' => false, 'message' => 'Ocurrió un error en el servidor: ', 'error' => $e->getMessage()], 500);
        }
    }
}

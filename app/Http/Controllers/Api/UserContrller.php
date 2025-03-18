<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserContrller extends Controller
{
    public function getUserCompany(Request $request, $company_id)
    {
        try {
            $users = null;

            if ($company_id == 0) {
                $users = User::where('role_id', '=', 2)
                    ->select('id', 'nombres', 'apellidos', 'cargo', 'doi')->get();
            } else {
                $users = User::where('company_id', $company_id)
                    ->where('role_id', '=', 2)
                    ->select('id', 'nombres', 'apellidos', 'cargo', 'doi')
                    ->get();
            }

            return response()->json(['status' => true, 'data' => $users], 200);
        } catch (\Exception $e) {
            // Log the error or handle it as needed
            // Include the exception message in the response for more detail
            return response()->json(['status' => false, 'message' => 'Ocurrió un error en el servidor: ', 'error' => $e->getMessage()], 500);
        }
    }
}

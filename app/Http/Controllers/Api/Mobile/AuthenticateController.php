<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SettingGlobal;
use Illuminate\Support\Facades\Hash;
use App\Helpers\LogHelper;

class AuthenticateController extends Controller
{
    /**
     * Autentica un usuario móvil.
     *
     * @param Request $request Request de Laravel (obligatorio)
     *   Parámetros esperados en $request:
     *   - version: string (obligatorio)
     *   - doi: string (obligatorio)
     *   - password: string (obligatorio)
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticate(Request $request)
    {
        try {
            $settingGlobal = SettingGlobal::first();
            // Verificar que la solicitud sea POST
            if (!$request->isMethod('post')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Método no permitido.',
                    'data' => null,
                ], 205);
            }

            // Validar que el campo 'version' sea igual a la versión configurada
            $version = $request->input('version');
            if ($version !== $settingGlobal->mobile_version) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Versión desactualizada.',
                    'data' => null,
                    'version' => $settingGlobal->mobile_version,
                ], 201);
            }

            $credentials = $request->only('doi', 'password');
            $user = User::where('doi', $credentials['doi'])->first();

            // Si el usuario no existe
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'El usuario no existe.',
                    'data' => null,
                ], 201);
            }

            if (!Hash::check($credentials['password'], $user->password)) {
                LogHelper::putLog($request, 'authenticate', 'User', $user->id ?? null, 'failed', 'Invalid credentials');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Las credenciales proporcionadas son incorrectas.',
                    'data' => null,
                ], 201);
            }

            // Verificar si el estado del usuario es 0
            if ($user->estado == 0) {
                LogHelper::putLog($request, 'authenticate', 'User', $user->id, 'failed', 'User is disabled');
                return response()->json([
                    'status' => 'error',
                    'message' => 'El acceso para este usuario ha sido deshabilitado.',
                    'data' => null,
                ], 201);
            }

            LogHelper::putLog($request, 'authenticate', 'User', $user->id, 'success', null);

            // Generar token de acceso con Sanctum
            $token = $user->createToken('mobile')->plainTextToken;

            // Devolver los datos del usuario y el token en la respuesta
            return response()->json([
                'status' => 'success',
                'message' => null,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->nombres,
                        'lastName' => $user->apellidos,
                        'fullName' => $user->nombres . ' ' . $user->apellidos,
                        'email' => $user->email,
                        'doi' => $user->doi,
                        'company' => [
                            'id' => $user->company_id,
                            'name' => $user->company->nombre ?? null,
                            'ruc' => $user->company->ruc ?? null,
                            'code' => $user->company->code ?? null,
                        ],
                        'role' => [
                            'id' => $user->role_id,
                            'name' => $user->role->nombre ?? null,
                            'code' => $user->role->code ?? null,
                        ],
                        'reports' => [
                            'canDailyPreuse' => false,
                            'canQuarterly' => false,
                            'canSemiannual' => false,
                            'canShutdown' => false,
                        ],
                    ],
                    'gerente' => 'Jorge Medina',
                    'token' => $token
                ],
            ], 200);
        } catch (\Exception $e) {
            LogHelper::putLog($request ?? null, 'authenticate', 'User', null, 'failed', $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Ocurrió un error durante la autenticación: ' . $e->getMessage(),
                'data' => null,
            ], 200);
        }
    }
}

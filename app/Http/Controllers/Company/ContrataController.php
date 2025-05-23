<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Http\Controllers\Repository\UserRepository;
use App\Models\User;
use App\Models\Role;
use App\Models\UeaCompany;
use Illuminate\Support\Facades\DB;

class ContrataController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index()
    {
        $companies = Company::all();
        return view('company.contrata.index', compact('companies'));
    }

    public function store(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                // Verificar si ya existe una empresa con el mismo nombre, correo, RUC o code
                $existingCompany = Company::where('ruc', $request->ruc)
                    ->orWhere('email', $request->email)
                    ->orWhere('nombre', $request->nombre)
                    ->orWhere('code', $request->code)
                    ->first();

                if ($existingCompany) {
                    throw new \Exception('Ya existe una empresa con el mismo nombre, correo electrónico, RUC o código.');
                }

                // Crear la empresa si no existe
                $company = Company::firstOrCreate(
                    ['ruc' => $request->ruc],
                    [
                        'nombre' => $request->nombre,
                        'descripcion' => $request->descripcion,
                        'email' => $request->email,
                        'code' => $request->code,
                    ]
                );

                // Buscar un usuario con el correo electrónico o DOI dado
                $user = User::where('email', $request->email)
                    ->orWhere('doi', $request->ruc)
                    ->first();

                // Si el usuario existe, lanzar una excepción
                if ($user) {
                    throw new \Exception('Ya existe un usuario con ese correo electrónico o DOI.');
                }

                // Crear un usuario para la empresa si no existe
                User::create([
                    'doi' => $request->ruc,
                    'nombres' => $request->nombre,
                    'apellidos' => '',
                    'password' => bcrypt($request->ruc),
                    // 'text_password' => $request->ruc,
                    'telefono' => null,
                    'email' => $request->email,
                    'codigo' => null,
                    'cargo' => 'Cuenta administrativa',
                    'company_id' => $company->id,
                    'role_id' => Role::where('nombre', 'Company Admin')->first()->id,
                    'empresa' => $company->nombre,
                ]);

                // Agregar la ueaCompany
                $ueaCompanyTypes = $request->ueaCompanyTypes;
                if ($ueaCompanyTypes) {
                    foreach ($ueaCompanyTypes as $ueaCompanyType) {
                        UeaCompany::create([
                            'company_id' => $company->id,
                            'uea_id' => $ueaCompanyType['ueaId'],
                            'activity_id' => $ueaCompanyType['companyTypeId'],
                        ]);
                    }
                }
            });

            return back()->with('success', 'Creada correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::transaction(function () use ($request, $id) {
                $company = Company::findOrFail($id);

                // Verificar si el RUC, email o code ya existen para otra empresa
                $existingCompany = Company::where(function ($query) use ($request, $id) {
                    $query->where('ruc', $request->ruc)
                        ->orWhere('email', $request->email)
                        ->orWhere('code', $request->code);
                })->where('id', '<>', $id)->first();

                if ($existingCompany) {
                    throw new \Exception('Ya existe una empresa con el mismo RUC, email o código.');
                }

                // Verificar si el email ya existe para otro usuario
                $existingUser = User::where('email', $request->email)
                    ->where('company_id', '<>', $company->id)
                    ->first();

                if ($existingUser) {
                    throw new \Exception('Ya existe un usuario con el mismo email.');
                }


                // Actualizar el usuario de la empresa
                $user_company = User::where('doi', $company->ruc)
                    ->where('role_id', Role::where('nombre', 'Company Admin')->first()->id)
                    ->first();

                // Actualizar la empresa
                $company->update([
                    'nombre' => $request->nombre,
                    'descripcion' => $request->descripcion,
                    'email' => $request->email,
                    'ruc' => $request->ruc,
                    'code' => $request->code,
                ]);


                if ($user_company) {
                    $user_company->update([
                        'doi' => $request->ruc,
                        'nombres' => $request->nombre,
                        'email' => $request->email,
                        'empresa' => $request->nombre,
                    ]);
                }

                // Eliminar las ueaCompany existentes
                UeaCompany::where('company_id', $company->id)->delete();

                // Agregar la ueaCompany
                $ueaCompanyTypes = $request->ueaCompanyTypes;
                if ($ueaCompanyTypes) {
                    foreach ($ueaCompanyTypes as $ueaCompanyType) {
                        UeaCompany::create([
                            'company_id' => $company->id,
                            'uea_id' => $ueaCompanyType['ueaId'],
                            'activity_id' => $ueaCompanyType['companyTypeId'],
                        ]);
                    }
                }
            });

            return back()->with('success', 'Actualizada correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema: ' . $e->getMessage());
        }
    }

    public function delete($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $contractor = Company::findOrFail($id);
                $contractor->estado = false;
                $contractor->save();

                // Eliminar la sesión de todos los usuarios de la empresa
                $users = User::where('company_id', $contractor->id)->get();
                foreach ($users as $user) {
                    DB::table('sessions')->where('user_id', $user->id)->delete();
                }
            });

            return back()->with('success', 'Eliminada correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema: ' . $e->getMessage());
        }
    }

    public function activate($id)
    {
        try {
            $contractor = Company::findOrFail($id);
            $contractor->estado = true;
            $contractor->save();
            return back()->with('success', 'Activada correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema: ' . $e->getMessage());
        }
    }

    public function showPassword($id)
    {
        try {
            $contractor = Company::findOrFail($id);
            $user = User::where('company_id', $contractor->id)
                ->where('role_id', Role::where('nombre', 'Company Admin')->first()->id)
                ->first();

            if ($user) {
                return response()->json(['success' => true, 'password' => $user->text_password]);
            } else {
                return response()->json(['success' => false, 'message' => 'Usuario no encontrado.']);
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Hubo un problema: ' . $e->getMessage()]);
        }
    }

    public function resetPassword($id)
    {
        try {
            $contractor = Company::findOrFail($id);
            $user = User::where('company_id', $contractor->id)
                ->where('role_id', Role::where('nombre', 'Company Admin')->first()->id)
                ->first();

            if ($user) {
                $user->update([
                    'password' => bcrypt($contractor->ruc),
                    'text_password' => $contractor->ruc,
                ]);

                return response()->json(['success' => true, 'message' => 'Contraseña restablecida correctamente.']);
            } else {
                return response()->json(['success' => false, 'message' => 'Usuario no encontrado.']);
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Hubo un problema: ' . $e->getMessage()]);
        }
    }
}

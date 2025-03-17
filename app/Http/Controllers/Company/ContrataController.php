<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Http\Controllers\Repository\UserRepository;
use App\Models\User;
use App\Models\Role;
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
                // Crear la empresa si no existe
                $company = Company::firstOrCreate(
                    ['ruc' => $request->ruc],
                    [
                        'nombre' => $request->nombre,
                        'descripcion' => $request->descripcion,
                        'email' => $request->email
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
                    'text_password' => $request->ruc,
                    'telefono' => null,
                    'email' => $request->email,
                    'codigo' => null,
                    'cargo' => 'Cuenta administrativa',
                    'company_id' => $company->id,
                    'role_id' => Role::where('nombre', 'Company Admin')->first()->id,
                    'empresa' => $company->nombre,
                ]);
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
                $company->update([
                    'nombre' => $request->nombre,
                    'descripcion' => $request->descripcion,
                    'email' => $request->email,
                    'estado' => $request->estado
                ]);
                $user_company = User::where('doi', $company->ruc)
                    ->where('role_id', Role::where('nombre', 'Company Admin')->first()->id)
                    ->first();
                $user = User::where('id', '<>', $user_company->id)
                    ->where(function ($query) use ($request) {
                        $query->where('email', $request->email)
                            ->orWhere('doi', $request->ruc);
                    })
                    ->first();

                if ($user) {
                    throw new \Exception('Ya existe un usuario con el mismo email o RUC.');
                }

                if ($user) {
                    $user->update([
                        'doi' => $request->ruc,
                        'nombres' => $request->nombre,
                        'email' => $request->email,
                        'empresa' => $request->nombre,
                        'estado' => $request->estado
                    ]);
                }
            });

            return back()->with('success', 'Actualizada correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema: ' . $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Level;
use App\Models\SystemRole;
use App\Models\User;
use App\Models\Entity;
use App\Models\Position;
use App\Models\SecurityEngineer;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Repository\UserRepository;

class UserController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    private function getEntities($entities, $levels)
    {
        $levels_map = $levels->mapWithKeys(function ($level) {
            return [$level->nombre => $level->orden];
        });

        $grouped_entities = [];

        foreach ($levels_map as $level_name => $level_order) {
            $filtered_entities = $entities->filter(function ($entity) use ($level_order) {
                return $entity->nivel == $level_order;
            });

            $grouped_entities[] = [
                'nombre' => $level_name,
                'orden' => $level_order,
                'items' => $filtered_entities->map(function ($entity) {
                    return [
                        'parent_id' => $entity->parent_id,
                        'id' => $entity->id,
                        'nombre' => $entity->nombre,
                        'nivel' => $entity->nivel
                    ];
                })->values()->toArray()
            ];
        }

        return $grouped_entities;
    }


    public function index()
    {
        $levels = Level::orderBy('orden', 'asc')->get();
        $systemRoles = SystemRole::all();
        $users = User::where('company_id', Auth::user()->company->id)
            ->where('cargo', '<>', 'Ingeniero de Seguridad')
            ->orderBy('id', 'desc')
            ->get();
        $entities = Entity::where('company_id', Auth::user()->company->id)->get();
        $positions = Position::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        return view('company.user.index', compact('levels', 'systemRoles', 'users', 'grouped_entities', 'positions'));
    }

    public function indexsecurity()
    {
        $levels = Level::orderBy('orden', 'asc')->get();
        $systemRoles = SystemRole::all();
        $user_ids = SecurityEngineer::where('company_id', Auth::user()->company->id)->pluck('user_id');
        $users = User::whereIn('id', $user_ids)->orderBy('id', 'desc')->get();
        $entities = Entity::where('company_id', Auth::user()->company->id)->get();
        $positions = Position::all();
        $grouped_entities = $this->getEntities($entities, $levels);
        return inertia('security/index', [
            'levels' => $levels,
            'systemRoles' => $systemRoles,
            'users' => $users,
            'grouped_entities' => $grouped_entities,
            'positions' => $positions,
        ]);
    }

    public function store(Request $request)
    {
        // Preparar los datos
        $systemRoles = SystemRole::find($request->input('rolesystem_id'));
        $level = Level::find($systemRoles->level_id);
        if ($level == null) {
            $level = Level::where('company_id', Auth::user()->company->id)
                ->orderby('orden', 'desc')
                ->first();
        }

        $key = str_replace(' ', '_', $level->nombre);

        $userData = [
            'doi' => $request->input('doi'),
            'nombres' => $request->input('nombres'),
            'apellidos' => $request->input('apellidos'),
            'password' => $request->input('password'),
            'telefono' => $request->input('telefono'),
            'email' => $request->input('email'),
            'codigo' => $request->input('codigo'),
            'cargo' => $request->input('position_id'),
            'rol' => 'Regular User',
            'empresa' => Auth::user()->company->nombre,
            'system_role_id' => $request->input('rolesystem_id'),
            'entity_id' => $request->input($key),
            'permisos' => $systemRoles->permisos,
            'contrata' => $request->input('contrata', 'SPCC'),
        ];

        try {
            // Crear el usuario
            $result = $this->userRepository->createEmployee($userData);
            if ($result['status'] == 'true') {

                SecurityEngineer::create([
                    'user_id' => $result['user']->id,
                    'company_id' => Auth::user()->company->id,
                ]);
                return redirect()->back()->with('success', $result['message']);
            } else {
                return redirect()->back()->with('error', $result['message']);
            }
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Hubo un problema al crear el usuario: ');
        }
    }
    public function update(Request $request, User $user)
    {
        try {
            $request->validate([
                'email' => [
                    'required',
                    'email',
                    'unique:users,email,' . $user->id,
                    function ($attribute, $value, $fail) use ($request) {
                        if ($value === $request->doi) {
                            $fail('El email y el DOI no pueden ser iguales.');
                        }
                    },
                ],
                'doi' => 'required|unique:users,doi,' . $user->id,
                'nombres' => 'required',
                'apellidos' => 'required',
                'telefono' => 'required',
            ], [
                'required' => 'El campo :attribute es obligatorio.',
                'email' => 'El campo :attribute debe ser una dirección de correo electrónico válida.',
                'unique' => 'El :attribute ya está en uso.',
            ]);

            $user->update($request->only(['nombres', 'apellidos', 'email', 'doi', 'telefono']));
            return redirect()->back()->with('success', 'Usuario actualizado exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema al actualizar el usuario: ' . $e->getMessage());
        }
    }
    public function destroy(User $user)
    {
        try {
            $user->estado = !$user->estado;
            $user->save();
            return redirect()->back()->with('success', 'Usuario desactivado exitosamente');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Hubo un problema al desactivar el usuario: ' . $th->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Repository;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use App\Models\Entity;
use App\Models\Role;

class UserRepository extends Controller
{
    public function create(array $data)
    {
        // Recuperamos los datos
        $doi = isset($data['doi']) ? $data['doi'] : null;
        $nombres = isset($data['nombres']) ? $data['nombres'] : null;
        $apellidos = isset($data['apellidos']) ? $data['apellidos'] : null;
        $password = isset($data['password']) ? $data['password'] : null;
        $telefono = isset($data['telefono']) ? $data['telefono'] : null;
        $email = isset($data['email']) ? $data['email'] : null;
        $codigo = isset($data['codigo']) ? $data['codigo'] : null;
        $cargo = isset($data['cargo']) ? $data['cargo'] : null;
        $rol = isset($data['rol']) ? $data['rol'] : null;
        $empresa = isset($data['empresa']) ? $data['empresa'] : null;
        $entidad = isset($data['entidad']) ? $data['entidad'] : null;

        $entity_id = null;
        if ($entidad) {
            $entity = Entity::where('nombre', $entidad)->first();
            $entity_id = $entity ? $entity->id : null;
        }

        $company_id = null;
        if ($empresa) {
            $company = Company::where('nombre', $empresa)->first();
            $company_id = $company ? $company->id : null;
        }

        $role_id = null;
        if ($rol) {
            $role = Role::where('nombre', $rol)->first();
            $role_id = $role ? $role->id : null;
        }

        try {
            $user = User::create([
                'doi' => $doi,
                'nombres' => $nombres,
                'apellidos' => $apellidos,
                'password' => bcrypt($password),
                'telefono' => $telefono,
                'email' => $email,
                'codigo' => $codigo,
                'cargo' => $cargo,
                'role_id' => $role_id,
                'company_id' => $company_id,
                'entity_id' => $entity_id,
            ]);

            return [
                'status' => 'true',
                'message' => 'Usuario creado exitosamente',
                'user' => $user,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'false',
                'message' => 'Hubo un problema al crear el usuario: ' . $e->getMessage(),
            ];
        }
    }

    public function createEmployee(array $data)
    {
        // Recuperamos los datos
        $doi = isset($data['doi']) ? $data['doi'] : null;
        $nombres = isset($data['nombres']) ? $data['nombres'] : null;
        $apellidos = isset($data['apellidos']) ? $data['apellidos'] : null;
        $password = isset($data['password']) ? $data['password'] : null;
        $telefono = isset($data['telefono']) ? $data['telefono'] : null;
        $email = isset($data['email']) ? $data['email'] : null;
        $codigo = isset($data['codigo']) ? $data['codigo'] : null;
        $cargo = isset($data['cargo']) ? $data['cargo'] : null;
        $rol = isset($data['rol']) ? $data['rol'] : null;
        $empresa = isset($data['empresa']) ? $data['empresa'] : null;
        $entity_id = isset($data['entity_id']) ? $data['entity_id'] : null;
        $system_role_id = isset($data['system_role_id']) ? $data['system_role_id'] : null;
        $permisos = isset($data['permisos']) ? $data['permisos'] : null;
        $company_id = null;
        $contrata = isset($data['contrata']) ? $data['contrata'] : null;
        if ($empresa) {
            $company = Company::where('nombre', $empresa)->first();
            $company_id = $company ? $company->id : null;
        }

        $role_id = null;
        if ($rol) {
            $role = Role::where('nombre', $rol)->first();
            $role_id = $role ? $role->id : null;
        }

        // Verificar si el usuario ya existe
        $existingUser = User::where('doi', $doi)->first();

        if ($existingUser) {
            // Si el usuario ya existe y la compañía es la misma, devolver un mensaje
            if ($existingUser->company_id == $company_id) {
                return [
                    'status' => 'false',
                    'message' => 'El usuario ya existe en la misma empresa',
                ];
            }

            // Si el usuario ya existe pero la compañía es diferente, copiar el id de la compañía en new_company_id
            $existingUser->new_company_id = $company_id;
            $existingUser->save();

            return [
                'status' => 'true',
                'message' => 'El usuario ya existe y será notificado de la migración de empresa',
                'user' => $existingUser,
            ];
        }

        try {
            $user = User::create([
                'doi' => $doi,
                'nombres' => $nombres,
                'apellidos' => $apellidos,
                'password' => bcrypt($doi),
                'telefono' => $telefono,
                'email' => $email,
                'codigo' => $codigo,
                'cargo' => $cargo,
                'role_id' => $role_id,
                'company_id' => $company_id,
                'entity_id' => $entity_id,
                'system_role_id' => $system_role_id,
                'permisos' => json_encode($permisos),
                'contrata' => $contrata,
            ]);

            return [
                'status' => 'true',
                'message' => 'Usuario creado exitosamente',
                'user' => $user,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'false',
                'message' => 'Hubo un problema al crear el usuario: ' . $e->getMessage(),
            ];
        }
    }
}

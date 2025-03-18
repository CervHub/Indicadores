<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\Entity;
use App\Models\SystemRole;
use App\Models\User;
use App\Models\EntityUser;

class EntityUserController extends Controller
{
    private function getUsers($entity_id)
    {
        $entity = Entity::find($entity_id);
        $nivel = $entity->nivel;
        $system_rol_ids = SystemRole::where('level_id', $nivel)->pluck('id');
        $users = User::whereNotNull('system_role_id')->get();
        $entity_user_ids = EntityUser::where('entity_id', $entity_id)->get()->pluck('user_id');

        // Divide la colección de usuarios en dos listas
        [$usersWithEntity, $usersWithoutEntity] = $users->partition(function ($user) use ($entity_user_ids) {
            return $entity_user_ids->contains($user->id);
        });

        // Transforma las colecciones de usuarios para incluir solo los atributos deseados y convierte las colecciones en arrays
        $usersWithEntity = array_values($usersWithEntity->map(function ($user) {
            return [
                'id' => $user->id,
                'nombres' => $user->nombres,
                'apellidos' => $user->apellidos,
                'cargo' => $user->cargo,
                'doi' => $user->doi
            ];
        })->toArray());

        $usersWithoutEntity = array_values($usersWithoutEntity->map(function ($user) {
            return [
                'id' => $user->id,
                'nombres' => $user->nombres,
                'apellidos' => $user->apellidos,
                'cargo' => $user->cargo,
                'doi' => $user->doi
            ];
        })->toArray());

        return ['usersWithEntity' => $usersWithEntity, 'usersWithoutEntity' => $usersWithoutEntity];
    }

    public function users($entity_id)
    {
        try {
            $data = $this->getUsers($entity_id);

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Conexión fallida: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Almacena una nueva entidad de usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function store(Request $request)
    {
        $user_id = intval($request->input('user_id'));
        $entity_id = intval($request->input('entity_id'));
        $cargo_company = $request->input('cargo');

        Log::info($request);
        if (empty($user_id) || $user_id == 0 || empty($entity_id) || $entity_id == 0) {
            Log::error('Datos inválidos', ['user_id' => $user_id, 'entity_id' => $entity_id]);
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos'
            ], 200);
        }

        Log::info('Datos recibidos', ['user_id' => $user_id, 'entity_id' => $entity_id]);

        $entity_user = EntityUser::firstOrCreate(
            ['user_id' => $user_id, 'entity_id' => $entity_id, 'cargo' => $cargo_company]
        );

        if ($entity_user->wasRecentlyCreated) {
            $user = User::findOrFail($user_id);
            $user->fill([
                'nombres' => $user->nombres,
                'apellidos' => $user->apellidos,
                'cargo' => $user->cargo,
                'doi' => $user->doi,
                'position_company_id' => $request->get('position_company_id') // Agregar el nuevo cargo
            ]);

            Log::info('EntityUser creada exitosamente', ['user' => $user]);
            return response()->json([
                'success' => true,
                'message' => 'EntityUser creada exitosamente',
                'user' => $user
            ], 200);
        } else {
            Log::info('EntityUser ya existe');
            return response()->json([
                'success' => false,
                'message' => 'EntityUser ya existe'
            ], 200);
        }
    }

    /**
     * Elimina una entidad de usuario.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $entity_user = EntityUser::find($id);

            if (!$entity_user) {
                return response()->json(['message' => 'EntityUser no encontrada'], 404);
            }

            $entity_user->delete();

            return response()->json(['message' => 'EntityUser eliminada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar EntityUser: ' . $e->getMessage()], 500);
        }
    }

    public function boss($entity_id)
    {
        try {
            $entity = Entity::find($entity_id);
            if (!$entity) {
                return response()->json(['success' => false, 'message' => 'Entidad no encontrada'], 404);
            }

            $bosses = EntityUser::where('entity_id', $entity_id)->with('user')->get();
            if ($bosses->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'Jefe no encontrado'], 404);
            }

            $bosses = $bosses->map(function ($boss) {
                $data = $boss->user->data();
                $data['cargo_entity'] = $boss->cargo; // Agregar el campo cargo
                return $data;
            });

            return response()->json(['success' => true, 'data' => $bosses], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error al obtener el jefe de la entidad: ' . $e->getMessage()], 500);
        }

    }
}

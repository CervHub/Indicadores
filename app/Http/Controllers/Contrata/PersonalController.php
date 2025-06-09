<?php

namespace App\Http\Controllers\Contrata;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\RoleUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

class PersonalController extends Controller
{
    public function index()
    {
        $excludedRoles = DB::table('roles')->whereIn('code', ['SA', 'CA'])->pluck('id');
        $company_id = Auth::user()->company_id;
        $roleCode = Auth::user()->role_code;

        $rolesQuery = DB::table('roles');
        if ($company_id !== '1') {
            $rolesQuery->whereIn('code', ['RU', 'IS']);
        } else {
            $rolesQuery->whereNotIn('code', ['SA', 'CA']);
        }
        $roles = $rolesQuery->get();

        $peopleQuery = DB::table('users')
            ->select([
                'users.id',
                'users.doi',
                'users.email',
                'users.nombres',
                'users.apellidos',
                'users.telefono',
                'users.cargo',
                'users.company_id',
                'users.role_id',
                'users.estado',
                'users.created_at',
                'users.updated_at',
                'companies.nombre as company_name',
                'companies.ruc as company_ruc',
            ])
            ->leftJoin('companies', 'users.company_id', '=', 'companies.id');

        if ($roleCode === 'SA') {
            $peopleQuery->whereNotIn('users.role_id', $excludedRoles);
        } elseif ($roleCode === 'CA') {
            $peopleQuery->whereNotIn('users.role_id', $excludedRoles)
                ->where('users.company_id', $company_id);
        }

        $people = $peopleQuery->orderBy('users.updated_at', 'desc')->get();
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

    public function updateMassive(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            // Debug: Check if file exists
            if (!$file || !$file->isValid()) {
                return redirect()->back()->with('error', 'El archivo no es válido o no se pudo cargar.');
            }

            // Usar PHPSpreadsheet directamente con alias
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray();

            // Verificar si el archivo contiene datos
            if (empty($data)) {
                return redirect()->back()->with('error', 'El archivo no contiene datos válidos.');
            }

            $result = $this->processExcelData($data);

            if (!$result['success']) {
                return redirect()->back()->with('error', $result['message']);
            }

            return redirect()->back()->with('success', $result['message']);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al procesar el archivo: ' . $e->getMessage());
        }
    }

    public function processExcelData($data)
    {
        if (empty($data)) {
            return ['success' => false, 'message' => 'El archivo no contiene datos.'];
        }

        // Límite máximo de registros a procesar
        $maxRecords = 20;

        // Validar que la primera fila contenga los encabezados requeridos
        $headers = array_map('strtoupper', array_map('trim', $data[0]));
        $requiredHeaders = ['RUC', 'APELLIDOS', 'NOMBRES', 'CELULAR', 'CORREO', 'DNI'];

        foreach ($requiredHeaders as $header) {
            if (!in_array($header, $headers)) {
                return [
                    'success' => false,
                    'message' => "El archivo debe contener la columna: {$header}"
                ];
            }
        }

        // Obtener índices de las columnas
        $columnIndexes = [];
        foreach ($requiredHeaders as $header) {
            $columnIndexes[$header] = array_search($header, $headers);
        }

        // Obtener el rol de Ingeniero de Seguridad
        $ingenieroSeguridadRole = Role::where('code', 'IS')->first();
        if (!$ingenieroSeguridadRole) {
            return ['success' => false, 'message' => 'No se encontró el rol de Ingeniero de Seguridad.'];
        }

        $processedCount = 0;
        $ignoredCount = 0;
        $updatedCount = 0;
        $createdCount = 0;
        $errors = [];

        // Procesar filas de datos (omitir la fila de encabezados y respetar el límite)
        $totalRowsToProcess = min(count($data) - 1, $maxRecords);
        
        for ($i = 1; $i <= $totalRowsToProcess; $i++) {
            $row = $data[$i];

            // Extraer datos usando los índices de columnas
            $userData = [
                'ruc' => isset($row[$columnIndexes['RUC']]) ? trim($row[$columnIndexes['RUC']]) : '',
                'apellidos' => isset($row[$columnIndexes['APELLIDOS']]) ? trim($row[$columnIndexes['APELLIDOS']]) : '',
                'nombres' => isset($row[$columnIndexes['NOMBRES']]) ? trim($row[$columnIndexes['NOMBRES']]) : '',
                'telefono' => isset($row[$columnIndexes['CELULAR']]) ? trim($row[$columnIndexes['CELULAR']]) : '',
                'email' => isset($row[$columnIndexes['CORREO']]) ? trim($row[$columnIndexes['CORREO']]) : '',
                'doi' => isset($row[$columnIndexes['DNI']]) ? trim($row[$columnIndexes['DNI']]) : '',
            ];

            // Validar datos obligatorios
            if (empty($userData['doi']) || empty($userData['nombres']) || empty($userData['apellidos']) || empty($userData['ruc'])) {
                $errors[] = "Fila " . ($i + 1) . ": RUC, DNI, nombres y apellidos son obligatorios.";
                continue;
            }

            try {
                // Buscar la empresa por RUC
                $company = DB::table('companies')->where('ruc', $userData['ruc'])->first();
                
                if (!$company) {
                    $errors[] = "Fila " . ($i + 1) . ": No se encontró la empresa con RUC: {$userData['ruc']}";
                    continue;
                }

                // Buscar usuario existente por DNI
                $user = User::where('doi', $userData['doi'])->first();

                if ($user) {
                    // Si el usuario existe, verificar si pertenece a la empresa
                    if ($user->company_id == $company->id) {
                        // Usuario existe y pertenece a la empresa - actualizar datos
                        $user->update([
                            'nombres' => $userData['nombres'],
                            'apellidos' => $userData['apellidos'],
                            'telefono' => $userData['telefono'],
                            'email' => $userData['email'],
                            'role_id' => $ingenieroSeguridadRole->id,
                        ]);

                        // Eliminar todos los roles existentes del usuario
                        RoleUser::where('user_id', $user->id)->delete();
                        
                        // Crear el nuevo rol de Ingeniero de Seguridad
                        RoleUser::create([
                            'user_id' => $user->id,
                            'role_id' => $ingenieroSeguridadRole->id,
                        ]);

                        $updatedCount++;
                    } else {
                        // Usuario existe pero no pertenece a la empresa - ignorar
                        $ignoredCount++;
                        continue;
                    }
                } else {
                    // Usuario no existe - crear nuevo usuario para la empresa
                    $user = User::create([
                        'doi' => $userData['doi'],
                        'nombres' => $userData['nombres'],
                        'apellidos' => $userData['apellidos'],
                        'telefono' => $userData['telefono'],
                        'email' => $userData['email'],
                        'password' => bcrypt($userData['doi']),
                        'company_id' => $company->id,
                        'role_id' => $ingenieroSeguridadRole->id,
                    ]);

                    // Crear registro en role_users
                    RoleUser::create([
                        'user_id' => $user->id,
                        'role_id' => $ingenieroSeguridadRole->id,
                    ]);

                    $createdCount++;
                }

                $processedCount++;
            } catch (\Exception $e) {
                $errors[] = "Fila " . ($i + 1) . ": Error al procesar - " . $e->getMessage();
            }
        }

        // Construir mensaje de resultado
        $message = "Procesamiento completado. ";
        $message .= "Creados: {$createdCount}, ";
        $message .= "Actualizados: {$updatedCount}, ";
        $message .= "Ignorados: {$ignoredCount}. ";
        
        if ($totalRowsToProcess < (count($data) - 1)) {
            $message .= "Se procesaron solo {$maxRecords} registros del total. ";
        }

        if (!empty($errors)) {
            $message .= "Errores encontrados: " . implode('; ', array_slice($errors, 0, 3));
            if (count($errors) > 3) {
                $message .= " y " . (count($errors) - 3) . " errores más.";
            }
        }

        return ['success' => true, 'message' => $message];
    }
}

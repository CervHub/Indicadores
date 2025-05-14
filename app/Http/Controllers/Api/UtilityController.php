<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Level;
use App\Models\Entity;
use App\Models\Company;
use App\Models\Category;
use App\Models\Module;
use App\Models\CategoryCompany;
use App\Models\SecurityEngineer;
use App\Models\EntityUser;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\TestEmail;
use App\Jobs\SendReportMail;
use App\Models\Log as LogModel;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use App\Models\SettingGlobal;


class UtilityController extends Controller
{
    public function getReportsMetrics(Request $request, $type)
    {
        $year = $request->year;
        $company_id = $request->company_id;
        $company_report_id = $request->company_report_id;
        $tipo_reporte = $request->tipo_reporte;

        $query = Module::select('modules.id', 'modules.fecha_reporte', 'modules.tipo_reporte', 'modules.estado', 'category_companies.nombre as category_company_name', 'modules.category_company_id', 'modules.company_id', 'modules.company_report_id', 'modules.levels')
            ->join('category_companies', 'modules.category_company_id', '=', 'category_companies.id')
            ->whereYear('modules.fecha_reporte', $year);

        if ($company_id) {
            $query->where('modules.company_id', $company_id);
        }

        if ($company_report_id) {
            $query->where('modules.company_report_id', $company_report_id);
        }

        if ($tipo_reporte) {
            $query->where('modules.tipo_reporte', $tipo_reporte);
        }

        $reports = $query->get();

        // Extraer solo el campo gerencia de levels
        $reports->transform(function ($report) {
            $levels = json_decode($report->levels, true);
            $report->gerencia = $levels['gerencia'] ?? null;
            unset($report->levels); // Eliminar el campo levels si no es necesario
            return $report;
        });

        return response()->json([
            'status' => true,
            'data' => $reports
        ]);
    }

    private function putLog(Request $request, $action, $model, $id, $status, $error_message)
    {
        $log = new LogModel();
        $log->action = $action;
        $log->model = $model;
        $log->user_id = $id; // Asegura que user_id puede ser null
        $log->ip_address = $request->ip();
        $log->user_agent = $request->userAgent();
        $log->status = $status;
        $log->details = json_encode($request->all()); // Codifica todos los datos de la solicitud en JSON
        $log->error_message = $error_message;
        $log->save();
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

    /**
     * Get the current API version.
     *
     * @return JsonResponse
     */
    public function getCurrentVersion(): JsonResponse
    {
        $settingGlobal = SettingGlobal::first();
        return response()->json([
            'success' => true,
            'version' => $settingGlobal->mobile_version ?? '0.0.0',
        ], 200);
    }

    /**
     * Get the current web version.
     *
     * @return JsonResponse
     */
    public function getCurrentVersionWeb(): JsonResponse
    {
        $settingGlobal = SettingGlobal::first();
        return response()->json([
            'success' => true,
            'version' => $settingGlobal->web_version ?? '0.0.0',
        ], 200);
    }

    public function authenticate(Request $request)
    {
        $settingGlobal = SettingGlobal::first();
        // Verificar que la solicitud sea POST
        if (!$request->isMethod('post')) {
            return response()->json(['error' => 'Método no permitido.'], 205);
        }

        // Validar que el campo 'version' sea igual a '2.2.2'
        $version = $request->input('version');
        if ($version !== $settingGlobal->mobile_version) {
            return response()->json(['message' => 'Versión desactualizada.'], 201);
        }

        try {
            $credentials = $request->only('doi', 'password');

            $user = User::where('doi', $credentials['doi'])->first();

            // SI el usuario no existe
            if (!$user) {
                return response()->json(['error' => 'El usuario no existe.'], 201);
            }

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                $this->putLog($request, 'authenticate', 'User', $user->id ?? null, 'failed', 'Invalid credentials');
                return response()->json(['error' => 'Las credenciales proporcionadas son incorrectas.'], 201);
            }

            // Verificar si el estado del usuario es 0
            if ($user->estado == 0) {
                $this->putLog($request, 'authenticate', 'User', $user->id, 'failed', 'User is disabled');
                return response()->json(['error' => 'El acceso para este usuario ha sido deshabilitado.'], 201);
            }

            $this->putLog($request, 'authenticate', 'User', $user->id, 'success', null);
            // Devolver los datos del usuario en la respuesta
            return response()->json(['success' => 'Conexión exitosa', 'user' => $user->data(), 'gerente' => 'Jorge Medina'], 200);
        } catch (\Exception $e) {
            $this->putLog($request, 'authenticate', 'User', null, 'failed', $e->getMessage());
            // Manejar la excepción y devolver un mensaje de error
            return response()->json(['error' => 'Ocurrió un error durante la autenticación: ' . $e->getMessage()], 200);
        }
    }

    public function entities($company_id)
    {
        try {
            // Comprobar si la empresa existe
            $company = Company::find($company_id);
            if (!$company) {
                return response()->json(['success' => false, 'message' => 'Empresa no encontrada'], 200);
            }

            $levels = Level::orderBy('orden', 'asc')->where('company_id', $company_id)->get();
            if ($levels->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'Niveles no encontrados para la empresa'], 200);
            }

            $entities = Entity::where('company_id', $company_id)->get();
            if ($entities->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'Entidades no encontradas'], 200);
            }

            $grouped_entities = $this->getEntities($entities, $levels);
            if (empty($grouped_entities)) {
                return response()->json(['success' => false, 'message' => 'Entidades agrupadas no encontradas'], 200);
            }

            return response()->json(['success' => true, 'data' => $grouped_entities], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Conexión fallida: ' . $e->getMessage()], 200);
        }
    }

    public function categories($company_id, $name)
    {
        try {
            $name = strtolower($name);
            $category = Category::where('company_id', $company_id)->whereRaw('LOWER(nombre) = ?', [strtolower($name)])->first();

            if (!$category) {
                return response()->json(['success' => false, 'message' => 'Categoría no encontrada'], 200);
            }
            $category_companies = $category->categoryCompanies()->select('id', 'nombre')->get();
            return response()->json(['success' => true, 'data' => $category_companies], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 200);
        }
    }


    public function storeReport(Request $request, $company_id)
    {
        $log = $request->all();
        Log::info(json_encode($log));
        // return response()->json(['status' => true, 'message' => 'Insertado satisfactoriamente', 'data' => $request->all()] ,200);

        $user = User::where($request->only('doi'))->first();
        if (!$user) {
            return response()->json(['status' => true, 'message' => 'Usuario no encontrado'], 404);
        }
        $user_id = $user->id;
        $data = [
            'fecha_reporte' => date('Y-m-d H:i:s', strtotime($request->fecha_reporte)),
            'fecha_evento' => date('Y-m-d H:i:s', strtotime($request->fecha_evento)),
            'company_id' => $company_id,
            'tipo_inspeccion' => $request->tipo_inspeccion,
            'estado' => 'Generado',
            'tipo_reporte' => $request->tipo_reporte,
            'descripcion' => $request->descripcion,
            'correctiva' => $request->correctiva,
            'gravedad' => $request->gravedad,
            'probabilidad' => $request->probabilidad,
            'exposicion' => $request->exposicion,
            'otros' => $request->otros,
            'mapa_cordenadas' => $request->mapa_cordenadas,
            'user_id' => $user_id,
            'reporte_usuarios_ids' => '{"jefe":3,"ingeniero_de_seguridad":16}',
            'firma' => $request->firma,
            'images' => $request->images,
            'levels' => $request->levels,
            'lugar' => $request->lugar,
            'category_company_id' => $request->causa_id,
            'comentario' => $request->comentario,
            'details' => $request->details,
            'company_report_id' => $request->company_report_id,
            'device' => $request->device,
        ];


        // if ($request->has('enable_gerente') && $request->enable_gerente == 'on') {
        //     $reporte_usuarios_ids = json_decode($data['reporte_usuarios_ids'], true);
        //     if (isset($reporte_usuarios_ids[0])) {
        //         $reporte_usuarios_ids = $reporte_usuarios_ids[0];
        //     }
        //     if (!isset($reporte_usuarios_ids['gerente'])) {
        //         $reporte_usuarios_ids['gerente'] = [];
        //     }
        //     $reporte_usuarios_ids['gerente'] = 61; // Add new user id here
        //     $data['reporte_usuarios_ids'] = json_encode($reporte_usuarios_ids); // Wrap in an additional array
        // }

        $report = null; // replace with actual report
        switch ($request->tipo_reporte) {
            case 'actos':
                $report = 'Actos subestandar';
                break;
            case 'condiciones':
                $report = 'Condiciones Subestandar';
                break;
            case 'incidentes':
                $report = 'Incidentes';
                break;
            case 'inspeccion':
                $report = 'Inspección';
                break;
            default:
                $report = ''; // replace with default value
                break;
        }
        //Envio de correo electronico
        //Solode la empresa de southern

        $roleSecurityEngineer = Role::where('code', 'IS')->first();
        $json = null;
        // Verifica si el rol existe
        if (!$roleSecurityEngineer) {
            Log::warning('El rol con código "IS" no existe. No se enviarán correos electrónicos.');
        } else {
            // Filtra los usuarios de seguridad por estos IDs y obtiene los correos electrónicos
            $seguridad_emails = User::where('estado', 1)
                ->where('role_id', $roleSecurityEngineer->id)
                ->whereNotNull('email') // Excluir usuarios sin correo electrónico
                ->where('email', '!=', '') // Excluir usuarios con correos vacíos
                ->get();

            // Verifica si hay ingenieros de seguridad disponibles
            if ($seguridad_emails->isEmpty()) {
                Log::info('No hay ingenieros de seguridad disponibles para enviar correos.');
            } else {
                // Mapea los correos electrónicos
                $json = $seguridad_emails->map(function ($user) {
                    return [
                        'email' => $user->email,
                        'nombre' => $user->nombres, // Asumiendo que el campo se llama 'nombres'
                        'apellidos' => $user->apellidos, // Asumiendo que el campo se llama 'apellidos'
                    ];
                })->toJson();


                // Aquí puedes agregar la lógica para enviar correos si es necesario
                Log::info('Correos electrónicos preparados para envío.');
            }
        }

        $data['send_email'] = $json;

        // El flujo continúa normalmente y el reporte se guarda
        Log::info('El flujo continúa y el reporte será guardado.');

        $date = $request->fecha_reporte; // replace with actual date
        $levels = json_decode($request->levels, true);

        if ($levels) {
            $managementEntity = Entity::find($levels['gerencia']);
            $management = $managementEntity ? $managementEntity->nombre : null;
        } else {
            $management = null;
        }
        $generatedBy = $user->nombres . ' ' . $user->apellidos; // replace with actual generatedBy

        try {
            $new_module = Module::create($data);

            $reportLink = route('company.reportability.download', ['reportability_id' => $new_module->id]);
            $date = $data['fecha_evento'];
            foreach ($seguridad_emails as $email) {
                SendReportMail::dispatch($email, $report, $date, $management, $generatedBy, $reportLink);
            }
            return response()->json(['status' => true, 'message' => 'Insertado satisfactoriamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function reports(Request $request)
    {
        $company_id = $request->company_id;
        $user_id = $request->user_id;

        if ($company_id === null || $user_id === null) {
            return response()->json([
                'status' => false,
                'message' => 'Los campos company_id y user_id son obligatorios'
            ], 200);
        }

        $tipo = $request->tipo;
        $fecha = $request->fecha;
        $estado = $request->estado;

        // Verificar si user_id es numérico
        if (!is_numeric($user_id)) {
            return response()->json([
                'status' => false,
                'message' => 'El user_id debe ser numérico'
            ], 200);
        }

        // Verificar si el usuario existe
        $userExists = User::where('id', $user_id)->exists();

        if (!$userExists) {
            return response()->json([
                'status' => false,
                'message' => 'El usuario no existe'
            ], 200);
        }

        // Obtener los módulos que están asociados con el user_id y company_id
        $query = Module::where('user_id', $user_id)
            ->where('company_id', $company_id);

        // Si existe un valor para fecha, añadir una condición para filtrar por fecha
        if ($fecha !== null) {
            $query->whereDate('fecha_reporte', $fecha);
        }

        // Si existe un valor para tipo, añadir una condición para filtrar por tipo
        if ($tipo !== null) {
            $query->where('tipo_reporte', $tipo);
        }

        // Si existe un valor para estado, añadir una condición para filtrar por estado
        // Si existe un valor para estado, añadir una condición para filtrar por estado
        if ($estado !== null) {
            switch ($estado) {
                case 0:
                    $query->where('estado', 'Generado');
                    break;
                case 1:
                    $query->where('estado', 'Revisado');
                    break;
                case 2:
                    $query->where('estado', 'Finalizado');
                    break;
            }
        }

        $modules = $query->get();

        // Procesar la información de cada módulo
        $processedModules = $modules->map(function ($module) {
            // Decodificar el campo reporte_usuarios_ids
            $reporteUsuariosIds = json_decode($module->reporte_usuarios_ids, true);

            // Buscar cada usuario y agregar solo su nombre y apellido al módulo
            $module->reporte_usuarios = array_map(function ($role, $userId) {
                if (is_numeric($userId)) {
                    $user = User::find($userId);
                    if ($user && isset($user->nombres) && isset($user->apellidos)) {
                        return [$role => $user->nombres . ' ' . $user->apellidos];
                    }
                }
                return [$role => $userId];
            }, array_keys($reporteUsuariosIds), $reporteUsuariosIds);



            // Decodificar el campo levels
            $levels = json_decode($module->levels, true);

            // Buscar cada entidad y agregar solo su nombre al módulo
            $module->levels_name = array_map(function ($level, $entityId) {
                if (is_numeric($entityId)) {
                    $entity = Entity::find($entityId);
                    if ($entity && isset($entity->nombre)) {
                        return [$level => $entity->nombre];
                    }
                }
                return [$level => $entityId];
            }, array_keys($levels), $levels);

            // Buscar la entidad en la tabla CategoryCompany usando category_company_id
            $categoryCompany = CategoryCompany::find($module->category_company_id);

            // Agregar el nombre de la entidad al módulo si se encuentra y tiene una propiedad nombre
            if ($categoryCompany && isset($categoryCompany->nombre)) {
                $module->category_company = $categoryCompany->nombre;
            } else {
                $module->category_company = null;
            }

            // Eliminar los campos que no quieres enviar
            unset($module->images);
            unset($module->firma);
            return $module;
        });

        $data = [
            'company_id' => $company_id,
            'user_id' => $user_id,
            'tipo' => $tipo,
            'fecha' => $fecha,
            'estado' => $estado,
            'modules' => $processedModules,
        ];

        return response()->json([
            'status' => true,
            'message' => $data
        ]);
    }

    public function myreports(Request $request)
    {
        $company_id = $request->query('company_id');
        $user_id = $request->query('user_id');

        if ($company_id === null || $user_id === null) {
            return response()->json([
                'status' => false,
                'message' => 'Los campos company_id y user_id son obligatorios'
            ], 400);
        }

        $entity_id = EntityUser::where('user_id', $user_id)
            ->where('cargo', 'Jefe')
            ->first()->entity_id;

        $entity = Entity::find($entity_id);
        $entity_name = $entity->nombre;
        $level = $entity->nivel;
        $level_name = Level::find($entity->nivel)->nombre;

        $tipo = $request->query('tipo');
        $fecha = $request->query('fecha');
        $estado = $request->query('estado');

        // Obtener los módulos que están asociados con el company_id
        $query = Module::where('company_id', $company_id);

        // Si existe un valor para fecha, añadir una condición para filtrar por fecha
        if ($fecha !== null) {
            $query->whereDate('fecha_reporte', $fecha);
        }

        // Si existe un valor para tipo, añadir una condición para filtrar por tipo
        if ($tipo !== null) {
            $query->where('tipo_reporte', $tipo);
        }

        // Si existe un valor para estado, añadir una condición para filtrar por estado
        if ($estado !== null) {
            switch ($estado) {
                case 0:
                    $query->where('estado', 'Generado');
                    break;
                case 1:
                    $query->where('estado', 'Revisado');
                    break;
                case 2:
                    $query->where('estado', 'Finalizado');
                    break;
            }
        }

        $modules = $query->get();

        // El resto del código sigue igual...

        // Procesar la información de cada módulo
        $processedModules = $modules->map(function ($module) {
            // Decodificar el campo reporte_usuarios_ids
            $reporteUsuariosIds = json_decode($module->reporte_usuarios_ids, true);

            // Buscar cada usuario y agregar solo su nombre y apellido al módulo
            $module->reporte_usuarios = array_map(function ($role, $userId) {
                $user = User::find($userId);
                if ($user && isset($user->nombres) && isset($user->apellidos)) {
                    return [$role => $user->nombres . ' ' . $user->apellidos];
                } else {
                    return null;
                }
            }, array_keys($reporteUsuariosIds), $reporteUsuariosIds);

            // Decodificar el campo levels
            $levels = json_decode($module->levels, true);

            // Buscar cada entidad y agregar solo su nombre al módulo
            $module->levels_name = array_map(function ($level, $entityId) {
                $entity = Entity::find($entityId);
                if ($entity && isset($entity->nombre)) {
                    return [$level => $entity->nombre];
                } else {
                    return null;
                }
            }, array_keys($levels), $levels);

            // Buscar la entidad en la tabla CategoryCompany usando category_company_id
            $categoryCompany = CategoryCompany::find($module->category_company_id);

            // Agregar el nombre de la entidad al módulo si se encuentra y tiene una propiedad nombre
            if ($categoryCompany && isset($categoryCompany->nombre)) {
                $module->category_company = $categoryCompany->nombre;
            } else {
                $module->category_company = null;
            }

            // Eliminar los campos que no quieres enviar
            unset($module->images);
            unset($module->firma);
            return $module;
        });

        $data = [
            'company_id' => $company_id,
            'user_id' => $user_id,
            'tipo' => $tipo,
            'fecha' => $fecha,
            'estado' => $estado,
            'modules' => $processedModules,
            'entity_id' => $entity_id,
            'entity_name' => $entity_name,
            'level' => $level,
            'level_name' => $level_name
        ];

        return response()->json([
            'status' => true,
            'message' => $data
        ]);
    }

    public function sendReportMail($email, $report, $date, $management, $generatedBy, $reportLink)
    {
        Mail::to($email)->send(new TestEmail($report, $date, $management, $generatedBy, $reportLink));
    }

    public function showCredentials(Request $request)
    {
        $companyId = $request->get('id');

        $company = Company::find($companyId);

        if ($company) {
            $user = User::where('doi', $company->ruc)->first();

            if ($user) {
                return response()->json([
                    'message' => 'Conexión exitosa',
                    'company' => [
                        'nombre' => $company->nombre,
                        'descripcion' => $company->descripcion,
                        'ruc' => $company->ruc
                    ],
                    'user' => [
                        'email' => $user->email,
                        'password' => $user->text_password
                    ]
                ]);
            } else {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
        } else {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }
    }

    public function yearMetrics(Request $request, $company)
    {
        $year = $request->get('year') ? $request->get('year') : date('Y');
        $company_id = $company;

        if ($company == 'all') {
            $modules = Module::selectRaw('CONVERT(varchar, fecha_evento, 23) as fecha_evento, tipo_reporte, tipo_inspeccion')
                ->whereRaw('YEAR(fecha_evento) = ?', [$year])
                ->get();
        } else {
            $modules = Module::selectRaw('CONVERT(varchar, fecha_evento, 23) as fecha_evento, tipo_reporte, tipo_inspeccion')
                ->where('company_id', $company_id)
                ->whereRaw('YEAR(fecha_evento) = ?', [$year])
                ->get();
        }

        return response()->json([
            'status' => true,
            'company' => $company,
            'year' => $year,
            'events' => $modules
        ]);
    }

    public function yearMetricsInspeccion(Request $request, $company)
    {
        $year = $request->get('year') ? $request->get('year') : date('Y');
        $company_id = $company;

        $inspeccionTypes = ['Inspección', 'inspeccion', 'inspección'];

        if ($company == 'all') {
            $modules = Module::selectRaw('CONVERT(varchar, fecha_evento, 23) as fecha_evento, tipo_reporte, tipo_inspeccion')
                ->whereRaw('YEAR(fecha_evento) = ?', [$year])
                ->whereIn('tipo_reporte', $inspeccionTypes)
                ->get();
        } else {
            $modules = Module::selectRaw('CONVERT(varchar, fecha_evento, 23) as fecha_evento, tipo_reporte, tipo_inspeccion')
                ->where('company_id', $company_id)
                ->whereRaw('YEAR(fecha_evento) = ?', [$year])
                ->whereIn('tipo_reporte', $inspeccionTypes)
                ->get();
        }

        return response()->json([
            'status' => true,
            'company' => $company,
            'year' => $year,
            'events' => $modules
        ]);
    }

    public function yearMetricsInspeccionDetalle(Request $request, $company)
    {
        $year = $request->year;
        $company_id = $request->company_id;
        $company_report_id = $request->company_report_id;

        $inspeccionTypes = ['Inspección', 'inspeccion', 'inspección'];

        $query = Module::selectRaw('CONVERT(varchar, fecha_evento, 23) as fecha_evento, tipo_reporte, tipo_inspeccion, SUBSTRING(details, 1, 30) as details, category_company_id, company_id, company_report_id, estado, fecha_reporte, levels, id')
            ->whereYear('fecha_evento', $year)
            ->whereIn('tipo_reporte', $inspeccionTypes);

        if ($company_id) {
            $query->where('company_id', $company_id);
        }

        if ($company_report_id) {
            $query->where('company_report_id', $company_report_id);
        }



        $modules = $query->get();

        $modules->transform(function ($module) {
            $details = $module->details;
            preg_match('/"id_detalle":"(\d+)"/', $details, $matches);
            $module->id_detalle = $matches[1] ?? null;
            $module->category_company_id = $module->id_detalle;

            $levels = json_decode($module->levels, true);
            $module->gerencia = $levels['gerencia'] ?? null;

            // Remove unwanted fields
            unset($module->details);
            unset($module->fecha_evento);
            unset($module->levels);
            unset($module->tipo_inspeccion);

            return $module;
        });

        return response()->json([
            'status' => true,
            'data' => $modules
        ]);
    }

    public function getCompanies(Request $request)
    {
        $companies = Company::where('estado', true)->get();
        $companies = $companies->map(function ($company) {
            return [
                'id' => $company->id,
                'nombre' => $company->nombre,
                'ruc' => $company->ruc
            ];
        });

        return response()->json([
            'status' => true,
            'companies' => $companies
        ]);
    }

    public function getUser(Request $request, $dni)
    {
        $company = $request->get('company');
        $user = User::where('doi', $dni)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Usuario no encontrado'
            ], 202);
        }

        if ($user->company_id != $company) {
            return response()->json([
                'status' => false,
                'message' => 'El usuario no pertenece a tu compañía especificada'
            ], 202);
        }

        $exist = SecurityEngineer::where('user_id', $user->id)->exists();

        if ($exist) {
            return response()->json([
                'status' => false,
                'message' => 'El usuario ya está autorizado como ingeniero de seguridad.'
            ], 202);
        }

        return response()->json([
            'status' => true,
            'dni' => $dni,
            'user' => $user,
            'company' => $company
        ]);
    }

    public function getReportJson(Request $request, $id)
    {
        $module = Module::find($id);

        if (!$module) {
            return response()->json([
                'status' => false,
                'message' => 'Módulo no encontrado'
            ], 404);
        }

        $module->reporte_usuarios_ids = json_decode($module->reporte_usuarios_ids, true);
        $module->levels = json_decode($module->levels, true);
        $module->images = json_decode($module->images, true); // Decodificar el campo images
        $module->details = json_decode($module->details, true); // Decodificar el campo details

        return response()->json([
            'status' => true,
            'module' => $module
        ]);
    }
}

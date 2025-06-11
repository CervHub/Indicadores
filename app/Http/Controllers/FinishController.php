<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ModuleReview;
use App\Models\Module;
use App\Models\User;
use App\Models\Company;
use App\Models\Role;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\TestEmail;

class FinishController extends Controller
{
    public function store(Request $request, $id)
    {
        $module = Module::find($id);
        $module->estado = 'Cerrado';
        $module->report_closed_at = now();
        $module->save();
        $user = auth()->user();

        $archivos = [
            'images' => [],
            'files' => []
        ];

        $fotosRutas = []; // Array simple de rutas para el campo fotos

        // Obtener los archivos del request
        $files = $request->file('files', []);

        // Crear las carpetas base si no existen
        $moduleDir = $module->id;
        $imagesPath = public_path("modules_fotos/{$moduleDir}");
        $filesPath = public_path("modules_files/{$moduleDir}");

        if (!file_exists($imagesPath)) {
            mkdir($imagesPath, 0755, true);
        }

        if (!file_exists($filesPath)) {
            mkdir($filesPath, 0755, true);
        }

        // Procesar cada archivo
        foreach ($files as $file) {
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();
            $size = $file->getSize();
            $uniqueName = uniqid() . '_' . $originalName;

            // Determinar si es imagen o archivo general
            if (str_starts_with($mimeType, 'image/')) {
                // Es una imagen
                $file->move($imagesPath, $uniqueName);
                $rutaCompleta = "modules_fotos/{$moduleDir}/{$uniqueName}";

                $archivos['images'][] = [
                    'original_name' => $originalName,
                    'stored_name' => $uniqueName,
                    'path' => $rutaCompleta,
                    'mime_type' => $mimeType,
                    'size' => $size,
                    'uploaded_at' => now()->toISOString()
                ];

                // Agregar solo la ruta al array simple
                $fotosRutas[] = $rutaCompleta;
            } else {
                // Es otro tipo de archivo
                $file->move($filesPath, $uniqueName);
                $rutaCompleta = "modules_files/{$moduleDir}/{$uniqueName}";

                $archivos['files'][] = [
                    'original_name' => $originalName,
                    'stored_name' => $uniqueName,
                    'path' => $rutaCompleta,
                    'mime_type' => $mimeType,
                    'size' => $size,
                    'uploaded_at' => now()->toISOString()
                ];

                // Agregar solo la ruta al array simple
                $fotosRutas[] = $rutaCompleta;
            }
        }

        // Crear Module review
        $moduleReview = ModuleReview::create([
            'module_id' => $module->id,
            'user_id' => $user->id,
            'comentario' => $request->input('descripcion'),
            'fotos' => json_encode($fotosRutas) // Guardar solo las rutas como strings
        ]);

        // Envío de notificación por correo electrónico
        try {
            $this->sendModuleFinishedMail($module, $user, $moduleReview);
        } catch (\Exception $emailException) {
            Log::error('Error al enviar correo de módulo finalizado: ' . $emailException->getMessage());
        }

        return redirect()->back()->with('success', 'Módulo finalizado correctamente');
    }

    private function sendModuleFinishedMail($module, $finishedBy, $moduleReview)
    {
        // Usuario principal que debe ser notificado (dueño del módulo)
        $moduleOwner = User::find($module->user_id);

        if (!$moduleOwner || !$moduleOwner->email) {
            Log::warning('Usuario del módulo no encontrado o sin email: ' . $module->user_id);
            return;
        }

        $ccEmails = collect();

        // Agregar todos los ingenieros de seguridad
        $roleSecurityEngineer = Role::where('code', 'IS')->first();
        if ($roleSecurityEngineer) {
            $securityEngineers = User::select('users.id', 'users.nombres', 'users.apellidos', 'users.email')
                ->distinct()
                ->leftJoin('assignments', 'assignments.user_id', '=', 'users.id')
                ->where('users.role_id', $roleSecurityEngineer->id)
                ->where('users.company_id', 1)
                ->where(function ($query) use ($module) {
                    $query->whereNull('assignments.user_id')
                        ->orWhere('assignments.company_id', $module->company_report_id);
                })
                ->get();

            $securityEngineers->each(function ($engineer) use ($ccEmails) {
                $ccEmails->push($engineer->email);
            });
        }

        // Agregar administrador de la empresa reportada (company_report_id)
        if ($module->company_report_id) {
            $companyReported = Company::find($module->company_report_id);
            if ($companyReported && $companyReported->email) {
                $ccEmails->push($companyReported->email);
            }
        }

        // Agregar usuario reportado (user_report_id)
        if ($module->user_report_id) {
            $userReported = User::find($module->user_report_id);
            if ($userReported && $userReported->email) {
                $ccEmails->push($userReported->email);
            }
        }

        // Eliminar correos duplicados y el del destinatario principal
        $ccEmails = $ccEmails->unique()->filter(function ($email) use ($moduleOwner) {
            return $email !== $moduleOwner->email;
        });

        // Preparar datos para el correo
        $moduleLink = route('company.reportability.download', ['reportability_id' => $module->id]);
        $finishedDate = now()->format('d/m/Y H:i');

        // Determinar el nombre del reporte basado en el tipo
        $report = null;
        switch ($module->tipo_reporte) {
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
                $report = $module->nombre ?? 'Módulo #' . $module->id;
                break;
        }

        $companyName = Company::find($module->company_id)->nombre ?? 'Sin empresa asignada';
        $companyReportedName = Company::find($module->company_report_id)->nombre ?? 'Sin empresa reportada';

        // Enviar el correo electrónico
        Mail::to($moduleOwner->email)
            ->cc($ccEmails->toArray())
            ->send(new TestEmail(
                $report,
                $finishedDate,
                $finishedBy->nombres . ' ' . $finishedBy->apellidos,
                $moduleLink,
                $companyName,
                $companyReportedName,
                'emails.closed_test_email',
                'CERRADO',
                $module
            ));

        Log::info('Correo de módulo finalizado enviado a: ' . $moduleOwner->email . ' con ' . $ccEmails->count() . ' copias.');
    }
}

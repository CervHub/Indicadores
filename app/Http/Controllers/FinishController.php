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
        $module->estado = 'Finalizado';
        $module->save();
        $user = auth()->user();

        $fotos = [];

        // Obtener las imágenes del request
        $imagenes = $request->file('images', []);

        // Crear la carpeta si no existe
        $destinationPath = public_path('modules_fotos');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // Procesar cada imagen
        foreach ($imagenes as $imagen) {
            // Crear un nombre único para la imagen
            $uniqueImageName = uniqid() . '_' . $imagen->getClientOriginalName();

            // Guardar la imagen en la carpeta
            $imagen->move($destinationPath, $uniqueImageName);

            // Agregar la ruta de la imagen al array $fotos
            $fotos[] = 'modules_fotos/' . $uniqueImageName;
        }

        // Crear Module review
        $moduleReview = ModuleReview::create([
            'module_id' => $module->id,
            'user_id' => $user->id,
            'comentario' => $request->input('descripcion'),
            'fotos' => json_encode($fotos) // Guardar las rutas de las fotos como JSON
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
            $securityEngineers = User::where('role_id', $roleSecurityEngineer->id)
                ->where('estado', 1)
                ->where('company_id', 1)
                ->whereNotNull('email')
                ->where('email', '!=', '')
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
                'CERRADO'
            ));

        Log::info('Correo de módulo finalizado enviado a: ' . $moduleOwner->email . ' con ' . $ccEmails->count() . ' copias.');
    }
}

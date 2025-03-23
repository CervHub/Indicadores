<?php

namespace App\Jobs;

use App\Models\Consolidated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Exports\AnnexExport;

class UpdateConsolidatedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $consolidationCreationService;

    /**
     * Create a new job instance.
     *
     * @param $consolidationCreationService
     * @return void
     */
    public function __construct($consolidationCreationService)
    {
        $this->consolidationCreationService = $consolidationCreationService;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $request = new Request([
            'year' => now()->year,
            'month' => now()->month,
        ]);

        try {
            $data = $this->consolidationCreationService->store($request);

            // Generar y guardar los archivos Excel en la carpeta 'public/consolidated'
            $filePaths = $this->saveExcelToPublic($data);

            $consolidated = Consolidated::updateOrCreate(
                [
                    'year' => $request['year'],
                    'month' => $request['month'],
                ],
                [
                    'user_id' => Auth::user()->id,
                    'is_closed' => true,
                    'file_accumulation' => $filePaths[0], // Guardar la ruta del tercer archivo generado
                    'file_concentrator' => $filePaths[1], // Guardar la ruta del primer archivo generado
                    'file_sx_ew' => $filePaths[2], // Guardar la ruta del segundo archivo generado
                ]
            );

            $mensaje = 'Consolidado creado con exito';
            if ($consolidated->wasRecentlyCreated) {
                $mensaje = 'Consolidado actualizado con exito';
            }

            if ($request->has('reconsolidated')) {
                $mensaje = 'Consolidado reconsolidado con exito';
            }

            Log::info($mensaje);
        } catch (\Exception $e) {
            Log::error('Error al crear o actualizar el consolidado: ' . $e->getMessage());
        }
    }

    /**
     * Save the generated Excel files to the public directory.
     *
     * @param array $data
     * @return array
     */
    private function saveExcelToPublic($data)
    {
        // Generar los archivos Excel
        $export = new AnnexExport($data);

        // Modificar y guardar los archivos Excel
        return $export->modifyAndSave();
    }
}

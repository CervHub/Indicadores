<?php

namespace App\Http\Controllers\Vehicle;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\VehicleCompany;
use Illuminate\Support\Facades\DB;

class VehicleController extends Controller
{
    protected $user;
    protected $company_id;

    public function __construct()
    {
        $this->user = Auth::user();
        $this->company_id = $this->user->company_id ?? null;
    }

    public function index()
    {
        $vehicles = VehicleCompany::with('vehicle')
            ->where('is_linked', true)
            ->when($this->company_id, function ($query) {
                $query->where('company_id', $this->company_id);
            })
            ->get();

        $company = $this->user->company ?? null;

        return Inertia::render('vehicle/index', [
            'vehicles' => $vehicles->map(function ($vehicleCompany) {
                $vehicle = $vehicleCompany->vehicle;
                $vehicle->code = $vehicleCompany->code; // Reemplazar el code del vehículo con el code del VehicleCompany
                return $vehicle;
            }),
            'company' => $company,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'code' => 'required|string|max:255',
                'license_plate' => 'required|string|max:255',
                'brand' => 'required|string|max:255',
                'model' => 'required|string|max:255',
                'color' => 'nullable|string|max:255',
                'year' => 'required|integer|min:1900|max:' . date('Y'),
                'engine_number' => 'nullable|string|max:255',
                'chassis_number' => 'nullable|string|max:255',
                'type' => 'required|string|max:255',
                'fuel_type' => 'nullable|string|max:255',
                'seating_capacity' => 'nullable|string|max:255',
                'mileage' => 'nullable|string|max:255',
                'is_active' => 'nullable|boolean',
                'insurance_expiry_date' => 'nullable|date',
                'spare_tire_count' => 'nullable',
                'tire_count' => 'nullable',
            ], [
                'required' => 'El campo :attribute es obligatorio.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'max' => 'El campo :attribute no debe exceder :max caracteres.',
                'integer' => 'El campo :attribute debe ser un número entero.',
                'min' => 'El campo :attribute debe ser al menos :min.',
                'date' => 'El campo :attribute debe ser una fecha válida.',
                'boolean' => 'El campo :attribute debe ser verdadero o falso.',
            ]);
            $code = $validatedData['code'];
            //quitar code de la validación
            unset($validatedData['code']);
            $vehicle = Vehicle::updateOrCreate(
                ['license_plate' => $validatedData['license_plate']],
                $validatedData
            );

            // Commit para evitar corrupción del índice usando el facade DB
            DB::beginTransaction();
            try {
                VehicleCompany::create([
                    'vehicle_id' => $vehicle->id,
                    'company_id' => $this->company_id,
                    'is_linked' => true,
                    'linked_by' => $this->user->id,
                    'code' => $code
                ]);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

            return redirect()->back()->with('success', 'Vehículo registrado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Ocurrió un error al registrar el vehículo: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);
            $validatedData = $request->validate([
                'code' => 'required|string|max:255',
                'license_plate' => 'required|string|max:255',
                'brand' => 'required|string|max:255',
                'model' => 'required|string|max:255',
                'color' => 'nullable|string|max:255',
                'year' => 'required|integer|min:1900|max:' . date('Y'),
                'engine_number' => 'nullable|string|max:255',
                'chassis_number' => 'nullable|string|max:255',
                'type' => 'required|string|max:255',
                'fuel_type' => 'nullable|string|max:255',
                'seating_capacity' => 'nullable|string|max:255',
                'mileage' => 'nullable|string|max:255',
                'is_active' => 'nullable|boolean',
                'insurance_expiry_date' => 'nullable|date',
            ]);

            $vehicle->update($validatedData);
            return redirect()->back()->with('success', 'Vehículo actualizado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Ocurrió un error al actualizar el vehículo: ' . $e->getMessage()]);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);
            $vehicleCompany = VehicleCompany::where('vehicle_id', $vehicle->id)
                ->where('is_linked', true)
                ->where('company_id', $this->company_id)
                ->first();
            if ($vehicleCompany) {
                $vehicleCompany->is_linked = false;
                $vehicleCompany->unlinked_by = $this->user->id;
                $vehicleCompany->save();
                return redirect()->back()->with('success', 'Vehículo desvinculado exitosamente.');
            } else {
                return redirect()->back()->withErrors(['error' => 'El vehículo no está vinculado a esta empresa.']);
            }
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Ocurrió un error al desvincular el vehículo: ' . $e->getMessage()]);
        }
    }

    public function link(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:vehicles,id',
            'company_id' => 'required|integer|exists:companies,id',
        ]);

        $vehicleId = $request->input('id');
        $companyId = $request->input('company_id');

        // Buscar el último registro de vinculación de este vehículo
        $lastLink = VehicleCompany::where('vehicle_id', $vehicleId)
            ->orderByDesc('updated_at')
            ->first();

        if ($lastLink && $lastLink->is_linked) {
            // Ya está vinculado a alguna empresa
            return redirect()->back()->withErrors(['error' => 'El vehículo ya se encuentra vinculado a una empresa.']);
        }

        try {
            VehicleCompany::create([
                'vehicle_id' => $vehicleId,
                'company_id' => $companyId,
                'is_linked' => true,
                'linked_by' => $this->user->id,
            ]);
            return redirect()->back()->with('success', 'Vehículo vinculado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Ocurrió un error al vincular el vehículo: ' . $e->getMessage()]);
        }
    }


    public function show(Request $request, $id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);
            $vehicleInspection = $vehicle->getCompanyInspections();
            $company = $vehicle->getLastActiveCompany();
            $lastCompanyLink = $vehicle->getLastCompanyLink();
            $allInspectionsHistory = $vehicle->getAllInspectionsHistory();
            return Inertia::render('vehicle/detail', [
                'vehicle' => $vehicle,
                'company' => $company,
                'lastCompanyLink' => $lastCompanyLink,
                'vehicleInspection' => $vehicleInspection,
                'allInspectionsHistory' => $allInspectionsHistory,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Ocurrió un error al mostrar el vehículo: ' . $e->getMessage()]);
        }
    }

    public function qr(Request $request, $vehicle_id)
    {
        try {
            $vehicle = Vehicle::findOrFail($vehicle_id);
            $vehicleInspection = $vehicle->getCompanyInspections();
            $company = $vehicle->getLastActiveCompany();
            $lastCompanyLink = $vehicle->getLastCompanyLink();
            return Inertia::render('vehicle/qr', [
                'vehicle' => $vehicle,
                'company' => $company,
                'lastCompanyLink' => $lastCompanyLink,
                'vehicleInspection' => $vehicleInspection,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Ocurrió un error al generar el código QR: ' . $e->getMessage()]);
        }
    }

    public function showAll()
    {
        $vehicles = \DB::select("
            WITH latest_vc AS (
                SELECT vc1.*
                FROM vehicle_companies vc1
                JOIN (
                    SELECT vehicle_id, MAX(updated_at) AS max_updated
                    FROM vehicle_companies
                    GROUP BY vehicle_id
                ) vc2
                ON vc1.vehicle_id = vc2.vehicle_id AND vc1.updated_at = vc2.max_updated
            ),
            inspection_data AS (
                SELECT
                    m.vehicle_plate,
                    m.tipo_inspeccion,
                    m.estado,
                    m.vehicle_status
                FROM modules m
            ),
            inspection_pivot AS (
                SELECT
                    vehicle_plate,
                    MAX(CASE WHEN tipo_inspeccion = 'pre-use' THEN estado ELSE NULL END) AS pre_use_estado,
                    MAX(CASE WHEN tipo_inspeccion = 'pre-use' THEN vehicle_status ELSE NULL END) AS pre_use_status,
                    MAX(CASE WHEN tipo_inspeccion = 'pre-use-visit' THEN estado ELSE NULL END) AS pre_use_visit_estado,
                    MAX(CASE WHEN tipo_inspeccion = 'pre-use-visit' THEN vehicle_status ELSE NULL END) AS pre_use_visit_status,
                    MAX(CASE WHEN tipo_inspeccion = 'trimestral' THEN estado ELSE NULL END) AS trimestral_estado,
                    MAX(CASE WHEN tipo_inspeccion = 'trimestral' THEN vehicle_status ELSE NULL END) AS trimestral_status,
                    MAX(CASE WHEN tipo_inspeccion = 'semestral' THEN estado ELSE NULL END) AS semestral_estado,
                    MAX(CASE WHEN tipo_inspeccion = 'semestral' THEN vehicle_status ELSE NULL END) AS semestral_status,
                    MAX(CASE WHEN tipo_inspeccion = 'anual' THEN estado ELSE NULL END) AS anual_estado,
                    MAX(CASE WHEN tipo_inspeccion = 'anual' THEN vehicle_status ELSE NULL END) AS anual_status
                FROM inspection_data
                GROUP BY vehicle_plate
            )
            SELECT
                v.license_plate AS placa,
                c.code + '-' + vc.code AS codigo,
                vc.is_linked,
                c.nombre AS nombre_company,
                ip.pre_use_estado,
                ip.pre_use_status,
                ip.pre_use_visit_estado,
                ip.pre_use_visit_status,
                ip.trimestral_estado,
                ip.trimestral_status,
                ip.semestral_estado,
                ip.semestral_status,
                ip.anual_estado,
                ip.anual_status
            FROM vehicles v
            LEFT JOIN latest_vc vc ON vc.vehicle_id = v.id
            LEFT JOIN companies c ON c.id = vc.company_id
            LEFT JOIN inspection_pivot ip ON ip.vehicle_plate = v.license_plate
        ");

        return Inertia::render('vehicleall/index', [
            'vehicles' => $vehicles,
        ]);
    }
}

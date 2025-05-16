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
        $vehiclesLinked = VehicleCompany::where('company_id', $this->company_id)
            ->where('is_linked', true)
            ->pluck('vehicle_id');

        // Obtener los vehículos
        $vehicles = Vehicle::whereIn('id', $vehiclesLinked)->get();


        return Inertia::render('vehicle/index', [
            'vehicles' => $vehicles,
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
            ], [
                'required' => 'El campo :attribute es obligatorio.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'max' => 'El campo :attribute no debe exceder :max caracteres.',
                'integer' => 'El campo :attribute debe ser un número entero.',
                'min' => 'El campo :attribute debe ser al menos :min.',
                'date' => 'El campo :attribute debe ser una fecha válida.',
                'boolean' => 'El campo :attribute debe ser verdadero o falso.',
            ]);

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
}

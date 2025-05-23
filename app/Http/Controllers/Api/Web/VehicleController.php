<?php

namespace App\Http\Controllers\Api\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\VehicleCompany;
use Illuminate\Support\Facades\Log;
use App\Models\Log as LogModel;

class VehicleController extends Controller
{
    /**
     * Retorna información del vehículo según placa
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVehicles(Request $request)
    {
        $request->validate([
            'license_plate' => 'required|string',
            'company_id' => 'nullable|integer',
        ]);

        $vehicle = Vehicle::where('license_plate', $request->input('license_plate'))->first();

        if ($vehicle) {
            // Si se pasa company_id, verifica si el vehículo está vinculado a OTRA empresa
            $registeredCompany = VehicleCompany::where('vehicle_id', $vehicle->id)
                ->where('is_linked', true)
                ->with('company')
                ->first();

            if ($request->input('company_id') && $registeredCompany) {
                return response()->json([
                    'status' => 'warning',
                    'message' => 'El vehículo ya se encuentra vinculado a otra empresa. Comuníquese con la empresa para que lo desvincule antes de continuar.',
                    'data' => [
                        'company' => [
                            'id' => $registeredCompany->company->id ?? null,
                            'name' => $registeredCompany->company->nombre ?? null,
                            'ruc' => $registeredCompany->company->ruc ?? null,
                        ],
                        'vehicle' => $vehicle,
                    ]
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'message' => null,
                'data' => $vehicle,
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'El vehículo no se encuentra registrado. Debe completar todos los campos para registrarlo.',
                'data' => null
            ], 404);
        }
    }

    public function getVehiclesInspection(Request $request)
    {
        $request->validate([
            'license_plate' => 'required|string',
            'company_id' => 'required|integer',
        ]);

        $vehicle = Vehicle::where('license_plate', $request->input('license_plate'))->first();

        if ($vehicle) {
            // Buscar el último registro de vinculación para ese vehículo y empresa
            $lastLink = VehicleCompany::where('vehicle_id', $vehicle->id)
                ->where('company_id', $request->input('company_id'))
                ->orderByDesc('updated_at')
                ->first();

            if ($lastLink && $lastLink->is_linked) {
                $vehicle->code = $lastLink->code;
                return response()->json([
                    'status' => 'success',
                    'message' => null,
                    'data' => $vehicle,
                    'company' => $lastLink->company ?? null,
                ], 200);
            } else {
                return response()->json([
                    'status' => 'warning',
                    'message' => 'El vehículo no está vinculado a tu empresa.',
                    'data' => null,
                ], 200);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'El vehículo no se encuentra registrado.',
                'data' => null,
            ], 404);
        }
    }
}

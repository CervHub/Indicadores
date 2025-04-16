<?php

namespace App\Http\Controllers\Vehicle;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function index()
    {
        return Inertia::render('vehicle/index', [
            'vehicles' => Vehicle::all(),
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
                'year' => 'required|integer|min:1900|max:' . date('Y'),
                'type' => 'required|string|max:255',
            ], [
                'required' => 'El campo :attribute es obligatorio.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'max' => 'El campo :attribute no debe exceder :max caracteres.',
                'integer' => 'El campo :attribute debe ser un número entero.',
                'min' => 'El campo :attribute debe ser al menos :min.',
            ]);

            $vehicle = Vehicle::updateOrCreate(
                ['license_plate' => $validatedData['license_plate']], // Condición para buscar el registro
                $validatedData // Datos para crear o actualizar
            );

            return redirect()->back()->with('success', 'Vehículo registrado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Ocurrió un error al registrar el vehículo: ' . $e->getMessage()]);
        }
    }
}

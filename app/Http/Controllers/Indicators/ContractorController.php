<?php

namespace App\Http\Controllers\Indicators;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ContractorCompanyType;
use App\Models\Company as ContractorCompany;
use App\Models\Uea;
use Illuminate\Support\Facades\DB;

class ContractorController extends Controller
{
    // Mostrar la lista de contratistas
    public function index()
    {
        // Aquí puedes obtener los datos de las contratistas desde la base de datos
        $contractors = ContractorCompany::with('uea')
            ->orderBy('created_at', 'desc')
            ->get();
        $contractorCompanyTypes = ContractorCompanyType::all();
        $ueas = Uea::all();
        return Inertia::render(
            'contractor/index',
            [
                'contractors' => $contractors,
                'contractorCompanyTypes' => $contractorCompanyTypes,
                'ueas' => $ueas,
            ]
        );
    }

    // Mostrar una contratista específica
    public function show($path)
    {
        // Aquí puedes obtener los datos de la contratista específica desde la base de datos
        $contractor = []; // Reemplaza esto con la lógica para obtener la contratista

        return Inertia::render('Contractor/Show', [
            'contractor' => $contractor,
        ]);
    }

    // Agregar una nueva contratista
    public function store(Request $request)
    {
        // Validar los datos entrantes
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'business_name' => 'nullable|string|max:255',
            'ruc_number' => 'required|string|max:20|unique:contractor_companies,ruc_number',
            'contractor_company_type_id' => 'required|exists:contractor_company_types,id',
        ]);

        DB::beginTransaction();

        try {
            // Crear una nueva instancia del modelo ContractorCompany
            $contractor = new ContractorCompany();

            // Llenar los datos usando el método fill
            $contractor->fill($validatedData);

            // Guardar la nueva instancia en la base de datos
            $contractor->save();

            // Confirmar la transacción
            DB::commit();

            // Redirigir o devolver una respuesta adecuada
            return redirect()->route('contractor.index')->with('success', 'Contratista agregada exitosamente.');
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();

            // Manejar el error (puedes personalizar este mensaje)
            return redirect()->route('contractor.index')->with('error', 'Hubo un problema al agregar la contratista.');
        }
    }

    // Actualizar una contratista existente
    public function update(Request $request, $path)
    {
        // Aquí puedes agregar la lógica para actualizar una contratista existente
    }

    // Eliminar una contratista
    public function destroy($path)
    {
        // Aquí puedes agregar la lógica para eliminar una contratista
    }
}

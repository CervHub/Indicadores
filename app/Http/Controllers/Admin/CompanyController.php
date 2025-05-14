<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
use App\Models\Company;
use App\Models\User;

class CompanyController extends Controller
{
    public function index(): View
    {
        $companies = Company::all();
        return view('admin.company.index', compact('companies'));
    }

    public function store(Request $request)
    {
        try {

            $data = $request->validate([
                'nombre' => 'required',
                'ruc' => 'required',
                'descripcion' => 'required',
                'email' => 'required|email',
            ]);

            Company::create($data);

            return redirect()->route('admin.companies')->with('success', 'Empresa creada exitosamente');
        } catch (\Exception $e) {
            return redirect()->route('admin.companies')->with('error', 'Error al crear la empresa: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Company $company)
    {
        $data = $request->validate([
            'nombre' => 'required',
            'ruc' => 'required',
            'descripcion' => 'required',
        ]);

        $company->update($data);

        return redirect()->route('admin.companies');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('admin.companies');
    }
}

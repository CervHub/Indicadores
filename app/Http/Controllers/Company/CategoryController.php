<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\CategoryCompany;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $company_id = 1;
        $categories = Category::where('company_id', $company_id)->with('categoryCompanies')->get();
        return Inertia::render('category/index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        try {
            $company_id = Auth::user()->company->id ?? 1; // Empresa por defecto es 1
            $nombre = trim($request->nombre); // Eliminar espacios

            // Verificar si ya existe una categoría con el mismo nombre para la empresa
            $existingCategory = Category::whereRaw('UPPER(TRIM(nombre)) = ?', [strtoupper($nombre)])
                ->where('company_id', $company_id)
                ->first();

            if ($existingCategory) {
                return redirect()->back()->with('error', 'Ya existe una categoría con el mismo nombre.');
            }

            $category = Category::create([
                'nombre' => $nombre,
                'company_id' => $company_id
            ]);

            return redirect()->back()->with('success', 'Categoría creada exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al crear la categoría: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $category = Category::find($id);
            if ($category) {
                $category->delete();
                return redirect()->route('company.category')->with('success', 'Category deleted successfully');
            } else {
                return redirect()->route('company.category')->with('error', 'Category not found');
            }
        } catch (\Exception $e) {
            return redirect()->route('company.category')->with('error', 'Error deleting category: ' . $e->getMessage());
        }
    }

    public function storeCompany(Request $request, $category_id)
    {
        try {
            $company_id = 1;
            $nombre = trim($request->input('nombre'));

            // Verificar si ya existe una categoría de empresa con el mismo nombre para la misma empresa y categoría
            $existingCategoryCompany = CategoryCompany::where('category_id', $category_id)
                ->where('company_id', $company_id)
                ->whereRaw('UPPER(TRIM(nombre)) = ?', [strtoupper($nombre)])
                ->first();

            if ($existingCategoryCompany) {
                return redirect()->back()->with('error', 'Ya existe una categoría de empresa con el mismo nombre.');
            }

            $category = Category::find($category_id);
            if ($category) {
                $category_company = CategoryCompany::create([
                    'category_id' => $category_id,
                    'company_id' => $company_id,
                    'nombre' => $nombre
                ]);
                return redirect()->back()->with('success', 'Categoría asignada a la empresa exitosamente');
            } else {
                return redirect()->back()->with('error', 'Categoría no encontrada');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al asignar la categoría a la empresa: ' . $e->getMessage());
        }
    }
}

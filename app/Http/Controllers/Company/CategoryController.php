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
        $company_id = Auth::user()->company->id ?? 0;
        $categories = Category::where('company_id', $company_id)->get();
        return Inertia::render('category/index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        try {
            $company_id = Auth::user()->company->id ?? 0;
            $category = Category::create([
                'nombre' => $request->nombre,
                'company_id' => $company_id
            ]);
            return redirect()->back()->with('success', 'Category created successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error creating category: ' . $e->getMessage());
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
            $company_id = Auth::user()->company->id ?? 0;
            $category = Category::find($category_id);
            if ($category) {
                $category_company = CategoryCompany::create([
                    'category_id' => $category_id,
                    'company_id' => $company_id,
                    'nombre' => $request->input('nombre') // Asegúrate de que el formulario envía un campo 'nombre'
                ]);
                return redirect()->route('company.category')->with('success', 'Category assigned to company successfully');
            } else {
                return redirect()->route('company.category')->with('error', 'Category not found');
            }
        } catch (\Exception $e) {
            return redirect()->route('company.category')->with('error', 'Error assigning category to company: ' . $e->getMessage());
        }
    }
}

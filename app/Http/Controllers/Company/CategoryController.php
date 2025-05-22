<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Group;
use App\Models\CategoryCompany;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $company_id = 1;
        $categories = Category::where('company_id', $company_id)->with('categoryCompanies', 'groups')->get();
        return Inertia::render('category/index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        try {
            $company_id = Auth::user()->company->id ?? 1; // Empresa por defecto es 1
            $nombre = trim($request->nombre); // Eliminar espacios
            $code = trim($request->code);

            // Verificar si ya existe una categoría con el mismo nombre para la empresa
            $existingCategory = Category::whereRaw('UPPER(TRIM(nombre)) = ?', [strtoupper($nombre)])
                ->where('company_id', $company_id)
                ->first();

            if ($existingCategory) {
                return redirect()->back()->with('error', 'Ya existe una categoría con el mismo nombre.');
            }

            // Verificar si ya existe una categoría con el mismo código para la empresa
            $existingCode = Category::whereRaw('UPPER(TRIM(code)) = ?', [strtoupper($code)])
                ->where('company_id', $company_id)
                ->first();

            if ($existingCode) {
                return redirect()->back()->with('error', 'Ya existe una categoría con el mismo código.');
            }

            $category = Category::create([
                'nombre' => $nombre,
                'company_id' => $company_id,
                'is_categorized' => $request->is_categorized,
                'code' => $code,
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
                $documentPath = null;
                if ($request->input('has_document') && $request->hasFile('document_url')) {
                    $file = $request->file('document_url');
                    $uniqueName = uniqid('doc_') . '_' . time() . '.' . $file->getClientOriginalExtension();
                    $documentPath = $file->storeAs('documents', $uniqueName);
                }

                $category_company = CategoryCompany::create([
                    'category_id' => $category_id,
                    'company_id' => $company_id,
                    'nombre' => $nombre,
                    'group_id' => $request->input('group_id'),
                    'is_required' => $request->input('is_required', false),
                    'attribute_type' => $request->input('attribute_type'),
                    'instruction' => $request->input('instruction'),
                    'has_attributes' => $request->input('has_attributes', false),
                    'document_name' => $request->input('document_name'),
                    'document_url' => $documentPath,
                ]);
                return redirect()->back()->with('success', 'Categoría asignada a la empresa exitosamente');
            } else {
                return redirect()->back()->with('error', 'Categoría no encontrada');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al asignar la categoría a la empresa: ' . $e->getMessage());
        }
    }

    public function updateCompany(Request $request, $category_id)
    {
        try {
            $company_id = 1; // O usa Auth::user()->company_id si aplica
            $nombre = trim($request->input('nombre'));
            $code = trim($request->input('code'));

            // Buscar la categoría de empresa por ID
            $categoryCompany = CategoryCompany::find($category_id);

            if (!$categoryCompany) {
                return redirect()->back()->with('error', 'Categoría de empresa no encontrada.');
            }

            // Verificar si ya existe otra categoría de empresa con el mismo nombre (ignorando el actual)
            $exists = CategoryCompany::where('category_id', $categoryCompany->category_id)
                ->where('company_id', $company_id)
                ->whereRaw('UPPER(TRIM(nombre)) = ?', [strtoupper($nombre)])
                ->where('id', '!=', $category_id)
                ->exists();

            if ($exists) {
                return redirect()->back()->with('error', 'Ya existe otra categoría de empresa con el mismo nombre.');
            }

            // Verificar si ya existe otra categoría con el mismo código (ignorando el actual)
            if ($code) {
                $existsCode = Category::whereRaw('UPPER(TRIM(code)) = ?', [strtoupper($code)])
                    ->where('company_id', $company_id)
                    ->where('id', '!=', $categoryCompany->category_id)
                    ->exists();

                if ($existsCode) {
                    return redirect()->back()->with('error', 'Ya existe otra categoría con el mismo código.');
                }

                // Actualizar el código en la categoría principal si se proporciona
                $category = Category::find($categoryCompany->category_id);
                if ($category) {
                    $category->update(['code' => $code]);
                }
            }

            $categoryCompany->update([
                'nombre' => $nombre,
                'group_id' => $request->input('group_id'),
                'is_required' => $request->input('is_required', false),
            ]);

            return redirect()->back()->with('success', 'Categoría de empresa actualizada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar la categoría de empresa: ' . $e->getMessage());
        }
    }

    public function groupStore(Request $request, $category_id)
    {
        try {
            $name = trim($request->input('name'));

            // Verificar si ya existe un grupo con el mismo nombre para la misma categoría
            $existingGroup = Group::where('category_id', $category_id)
                ->whereRaw('UPPER(TRIM(name)) = ?', [strtoupper($name)])
                ->first();

            if ($existingGroup) {
                return redirect()->back()->with('error', 'Ya existe un grupo con el mismo nombre.');
            }

            $group = Group::create([
                'category_id' => $category_id,
                'name' => $name
            ]);

            return redirect()->back()->with('success', 'Grupo creado exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al crear el grupo: ' . $e->getMessage());
        }
    }
}

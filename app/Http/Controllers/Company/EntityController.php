<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Entity;
use App\Models\Level;

class EntityController extends Controller
{
    public function index($order = null, $parent_id = null)
    {
        $entities = Entity::where('company_id', Auth::user()->company->id)
            ->where('nivel', $order)
            ->where('parent_id', $parent_id)
            ->get();
        $level = Level::where('company_id', Auth::user()->company->id)
            ->where('orden', $order)
            ->first();
        $parent = Entity::find($parent_id);
        $maxLevel = Level::where('company_id', Auth::user()->company->id)->max('orden');
        $levels = Level::where('company_id', Auth::user()->company->id)->get();
        return view('company.entity.index', compact('entities', 'order', 'parent_id', 'level', 'parent', 'maxLevel', 'levels'));
    }

    public function store($order, $parent_id, Request $request)
    {
        try {
            $company = Auth::user()->company;
            $entity = new Entity();
            $entity->company_id = $company->id;
            $entity->nombre = $request->nombre;
            $entity->nivel = $order;

            $parentEntity = Entity::find($parent_id);
            $entity->parent_id = $parentEntity ? $parentEntity->id : null;

            $entity->save();

            return back()->with('success', 'Creada correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema: ' . $e->getMessage());
        }
    }
}

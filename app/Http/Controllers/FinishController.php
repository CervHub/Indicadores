<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ModuleReview;
use App\Models\Module;

class FinishController extends Controller
{
    public function store(Request $request, $id)
    {
        $module = Module::find($id);
        $module->estado = 'Finalizado';
        $module->save();
        $user = auth()->user();

        $fotos = [];

        // Obtener las imágenes del request
        $imagenes = $request->file('images', []);

        // Crear la carpeta si no existe
        $destinationPath = public_path('modules_fotos');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // Procesar cada imagen
        foreach ($imagenes as $imagen) {
            // Crear un nombre único para la imagen
            $uniqueImageName = uniqid() . '_' . $imagen->getClientOriginalName();

            // Guardar la imagen en la carpeta
            $imagen->move($destinationPath, $uniqueImageName);

            // Agregar la ruta de la imagen al array $fotos
            $fotos[] = 'modules_fotos/' . $uniqueImageName;
        }

        // Crear Module review
        ModuleReview::create([
            'module_id' => $module->id,
            'user_id' => $user->id,
            'comentario' => $request->input('descripcion'),
            'fotos' => json_encode($fotos) // Guardar las rutas de las fotos como JSON
        ]);

        return redirect()->back()->with('success', 'Módulo finalizado correctamente');
    }
}

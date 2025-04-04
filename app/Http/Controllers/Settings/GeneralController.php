<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SettingGlobal;
use Inertia\Inertia;

class GeneralController extends Controller
{
    public function index()
    {
        // Consultar SettingGlobal, si no existe devolver una colección vacía
        $settingGlobal = SettingGlobal::first() ?? collect();

        // Retornar la vista con Inertia
        return Inertia::render('settings/index', [
            'settingGlobal' => $settingGlobal,
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'web_version' => 'nullable|string|max:255',
            'mobile_version' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'mini_logo' => 'nullable|string|max:255',
            'general_notes' => 'nullable|string',
        ]);

        // Crear o actualizar el registro en la base de datos
        SettingGlobal::updateOrCreate(
            ['id' => 1], // Puedes ajustar esta lógica según tus necesidades
            $validatedData
        );

        // Redirigir al índice con un mensaje de éxito
        return redirect()->route('settings.general.index')->with('success', 'Configuración actualizada correctamente.');
    }
}

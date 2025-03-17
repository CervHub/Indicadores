<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index(): View
    {
        $setting = Auth::user()->company->setting;
        return view('company.setting.index', compact('setting'));
    }
    public function store(Request $request)
    {
        try {
            $companyId = Auth::user()->company->id;
            $setting = Setting::firstWhere('company_id', $companyId);

            if (!$setting) {
                $setting = new Setting;
                $setting->company_id = $companyId;
            }

            $setting->num_niveles = $request->input('num-niveles') ?? null;

            if ($request->hasFile('logo')) {
                $setting->logo = $request->file('logo')->storePublicly('logos', 'public');
            }

            if ($request->hasFile('mini-logo')) {
                $setting->mini_logo = $request->file('mini-logo')->storePublicly('mini-logos', 'public');
            }
            $setting->save();

            // Agrega un mensaje de éxito a la sesión
            session()->flash('success', 'Configuración guardada con éxito.');

            return redirect()->route('company.settings.index');
        } catch (\Exception $e) {
            // Agrega un mensaje de error a la sesión
            session()->flash('error', 'Hubo un problema al guardar la configuración: ' . $e->getMessage());

            return redirect()->back();
        }
    }
}

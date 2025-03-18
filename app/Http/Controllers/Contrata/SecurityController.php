<?php

namespace App\Http\Controllers\Contrata;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SecurityEngineer;

class SecurityController extends Controller
{
    public function index()
    {
        $user_ids = SecurityEngineer::where('company_id', auth()->user()->company_id)->pluck('user_id');
        $people = User::whereIn('id', $user_ids)->get();
        return view('contrata.security-engineer.index', compact('people'));
    }
    public function store(Request $request)
    {
        try {
            $user = User::where('doi', $request->dni)->first();

            if (!$user) {
                return redirect()->route('security-engineer')->withErrors('Usuario no encontrado.');
            }

            SecurityEngineer::create([
                'user_id' => $user->id,
                'company_id' => auth()->user()->company_id,
            ]);

            return redirect()->route('security-engineer')->with('success', 'Ingeniero de Seguridad creado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('security-engineer')->withErrors('Ocurrió un error: ' . $e->getMessage());
        }
    }

    public function destroy($dni)
    {
        try {
            $user = User::where('doi', $dni)->first();

            if (!$user) {
                return redirect()->route('security-engineer')->withErrors('Usuario no encontrado.');
            }

            SecurityEngineer::where('user_id', $user->id)->delete();

            return redirect()->route('security-engineer')->with('success', 'Ingeniero de Seguridad eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('security-engineer')->withErrors('Ocurrió un error: ' . $e->getMessage());
        }
    }
}

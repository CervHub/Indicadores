<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */

    public function store(LoginRequest $request): RedirectResponse
    {
        if ($request->has('email')) {
            $emailOrDoi = $request->email;

            // Verificar si el usuario es admin (role_id 1)
            $user = \App\Models\User::where('email', $emailOrDoi)->first();
            if ($user && $user->role_id == 1) {
                // Si es admin, autenticar con correo
                $request->merge(['email' => $emailOrDoi]);
            } else {
                // Si no es admin, autenticar con DOI
                $user = \App\Models\User::where('doi', $emailOrDoi)->first();
                if (!$user) {
                    return redirect()->route('login')->withErrors(['error' => 'Credenciales inválidas.']);
                }
                $request->merge(['email' => $user->email]);
            }
        }

        $request->authenticate();

        $user = Auth::user();

        // Verificar el estado del usuario
        if ($user->estado !== '1') {
            Auth::logout();
            return redirect()->route('login')->withErrors(['error' => 'Tu cuenta está inactiva.']);
        }

        // Verificar el rol del usuario y el estado de la compañía si aplica
        if ($user->role_id == 1) {
            // Caso 1: El usuario es admin (role_id 1), permitir acceso
        } elseif ($user->role_id == 2) {
            // Caso 2: El usuario es normal (role_id 2)
            if (!$user->isSecurityEngineer()) {
                Auth::logout();
                return redirect()->route('login')->withErrors(['error' => 'No tienes permiso para iniciar sesión.']);
            }
            if (!$user->company || $user->company->estado !== '1') {
                Auth::logout();
                return redirect()->route('login')->withErrors(['error' => 'Tu empresa está inactiva o no tienes una empresa asociada.']);
            }
        } elseif ($user->role_id == 3) {
            // Caso 3: El usuario es empresa (role_id 3)
            if (!$user->company || $user->company->estado !== '1') {
                Auth::logout();
                return redirect()->route('login')->withErrors(['error' => 'Tu empresa está inactiva o no tienes una empresa asociada.']);
            }
        } else {
            // Caso 4: El usuario tiene un rol no permitido
            Auth::logout();
            return redirect()->route('login')->withErrors(['error' => 'No tienes permiso para iniciar sesión.']);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

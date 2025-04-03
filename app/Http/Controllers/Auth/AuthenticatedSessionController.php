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
        // Validar que el email y la contraseña estén presentes
        if (!$request->has('email') || !$request->has('password')) {
            return redirect()->route('login')->withErrors(['error' => 'El correo electrónico/DOI y la contraseña son obligatorios.']);
        }

        $emailOrDoi = $request->email;
        $credentials = [];

        if (str_contains($emailOrDoi, '@')) {
            // Caso 1: Login con correo electrónico
            $user = \App\Models\User::where('email', $emailOrDoi)->first();

            if (!$user) {
                return redirect()->route('login')->withErrors(['error' => 'Credenciales inválidas.']);
            }

            if ($user->role_id != 1) {
                return redirect()->route('login')->withErrors(['error' => 'No tienes permiso para iniciar sesión.']);
            }

            $credentials['email'] = $emailOrDoi;
        } else {
            // Caso 2: Login con DOI
            $user = \App\Models\User::where('doi', $emailOrDoi)->first();

            if (!$user) {
                return redirect()->route('login')->withErrors(['error' => 'Credenciales inválidas.']);
            }

            // Autenticación con DOI y contraseña
            $credentials['doi'] = $emailOrDoi;

            // Validaciones adicionales para usuarios con DOI
            if ($user->estado !== '1') {
                Auth::logout();
                return redirect()->route('login')->withErrors(['error' => 'Tu cuenta está inactiva.']);
            }

            if ($user->role_id == 2) {
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
        }

        // Agregar la contraseña a las credenciales
        $credentials['password'] = $request->password;

        if (!Auth::attempt($credentials)) {
            return redirect()->route('login')->withErrors(['error' => 'Credenciales inválidas.']);
        }

        $user = Auth::user();

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

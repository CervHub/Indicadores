<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'nombres' => ['nullable', 'string'],
            'apellidos' => ['nullable', 'string'],
        ]);

        // Concatenar nombres y apellidos para el campo name
        $validated['name'] = trim(($validated['nombres'] ?? '') . ' ' . ($validated['apellidos'] ?? ''));
        
        // Si name queda vacío, usar el email como fallback
        if (empty($validated['name'])) {
            $validated['name'] = $validated['email'];
        }

        // Actualizar todos los campos incluyendo nombres y apellidos
        $request->user()->fill([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'nombres' => $validated['nombres'],
            'apellidos' => $validated['apellidos'],
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

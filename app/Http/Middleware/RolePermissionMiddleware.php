<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RolePermissionMiddleware
{
    /**
     * Roles por ruta/módulo - Mismo criterio que en el frontend
     */
    private array $roles = [
        'dashboard' => ['SA', 'IS', 'CA', 'SCC', 'ALM', 'PI', 'CO', 'CS', 'RU'],
        'contractor' => ['SA'], // Empresas
        'admin.management' => ['SA'], // Gerencias
        'admin.category' => ['SA'], // Gestión de SSO
        'vehicle' => [], // Vehículos
        'annexes' => ['CA'], // Indicadores
        'consolidated' => ['SA', 'CA', 'SCC', 'ALM', 'PI', 'CO', 'CS'], // Consolidados
        'admin.reportability' => ['SA', 'IS', 'CA', 'SCC'], // Reporte
        'format' => [], // Formatos
        'inspection' => [], // Inspecciones
        'settings.general' => ['SA'], // Configuración
        'contrata.personal' => ['CA', 'SA'], // Personal
        'admin.security-engineer' => [], // Ingeniero de Seguridad
        'contrata.roles' => [], // Roles
        'assignments' => ['SA'], // Asignaciones
    ];

    /**
     * Items restringidos que requieren company_id = '1'
     */
    private array $restrictedItems = [
        'consolidated' => true,
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Si el usuario no está autenticado, continuar (el middleware auth se encargará)
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $userRoleCode = $user->role_code;
        $userCompanyId = $user->company_id;
        $routeName = $request->route()->getName();

        // Debug log
        \Log::info('RolePermissionMiddleware:', [
            'route' => $routeName,
            'user_role' => $userRoleCode,
            'company_id' => $userCompanyId
        ]);

        // Si no hay route name, permitir acceso
        if (!$routeName) {
            return $next($request);
        }

        // Obtener la clave de rol para esta ruta
        $roleKey = $this->getRoleKeyFromRoute($routeName);
        // Si no hay configuración para esta ruta, permitir acceso
        if (!$roleKey) {
            \Log::info('No role key found for route: ' . $routeName);
            return $next($request);
        }

        // Verificar restricciones por company_id
        if ($this->isRestrictedItem($roleKey) && $userCompanyId !== '1') {
            \Log::info('Access denied - Company restriction');
            return $this->redirectToDashboard($request);
        }

        // Obtener roles permitidos para esta ruta
        $allowedRoles = $this->roles[$roleKey] ?? [];

        \Log::info('Role verification:', [
            'role_key' => $roleKey,
            'user_role' => $userRoleCode,
            'allowed_roles' => $allowedRoles
        ]);

        // Si no hay roles definidos (array vacío), DENEGAR acceso
        if (empty($allowedRoles)) {
            \Log::info('Access denied - No roles defined for: ' . $roleKey);
            return $this->redirectToDashboard($request);
        }

        // Verificar si el usuario tiene permisos
        if (!in_array($userRoleCode, $allowedRoles)) {
            \Log::info('Access denied - Role mismatch', [
                'user_role' => $userRoleCode,
                'allowed_roles' => $allowedRoles,
                'role_key' => $roleKey
            ]);
            return $this->redirectToDashboard($request);
        }

        \Log::info('Access granted');
        return $next($request);
    }

    /**
     * Obtener la clave de rol basada en el nombre de la ruta
     */
    private function getRoleKeyFromRoute(string $routeName): ?string
    {
        // Mapeo de nombres de rutas a claves de roles
        $routeMapping = [
            // Dashboard
            'dashboard' => 'dashboard',

            // Empresas
            'contractor.index' => 'contractor',
            'contractor.create' => 'contractor',
            'contractor.store' => 'contractor',
            'contractor.show' => 'contractor',
            'contractor.edit' => 'contractor',
            'contractor.update' => 'contractor',
            'contractor.destroy' => 'contractor',

            // Gerencias
            'admin.management.index' => 'admin.management',
            'admin.management.create' => 'admin.management',
            'admin.management.store' => 'admin.management',
            'admin.management.show' => 'admin.management',
            'admin.management.edit' => 'admin.management',
            'admin.management.update' => 'admin.management',
            'admin.management.destroy' => 'admin.management',

            // Gestión de SSO
            'admin.category.index' => 'admin.category',
            'admin.category.create' => 'admin.category',
            'admin.category.store' => 'admin.category',
            'admin.category.show' => 'admin.category',
            'admin.category.edit' => 'admin.category',
            'admin.category.update' => 'admin.category',
            'admin.category.destroy' => 'admin.category',

            // Vehículos
            'vehicle.index' => 'vehicle',
            'vehicle.create' => 'vehicle',
            'vehicle.store' => 'vehicle',
            'vehicle.show' => 'vehicle',
            'vehicle.edit' => 'vehicle',
            'vehicle.update' => 'vehicle',
            'vehicle.destroy' => 'vehicle',

            // Indicadores
            'annexes.index' => 'annexes',
            'annexes.create' => 'annexes',
            'annexes.store' => 'annexes',
            'annexes.show' => 'annexes',
            'annexes.edit' => 'annexes',
            'annexes.update' => 'annexes',
            'annexes.destroy' => 'annexes',

            // Consolidados
            'consolidated.index' => 'consolidated',
            'consolidated.create' => 'consolidated',
            'consolidated.store' => 'consolidated',
            'consolidated.show' => 'consolidated',
            'consolidated.edit' => 'consolidated',
            'consolidated.update' => 'consolidated',
            'consolidated.destroy' => 'consolidated',

            // Reporte
            'admin.reportability.index' => 'admin.reportability',
            'admin.reportability.create' => 'admin.reportability',
            'admin.reportability.store' => 'admin.reportability',
            'admin.reportability.show' => 'admin.reportability',
            'admin.reportability.edit' => 'admin.reportability',
            'admin.reportability.update' => 'admin.reportability',
            'admin.reportability.destroy' => 'admin.reportability',

            // Formatos
            'format.index' => 'format',
            'format.create' => 'format',
            'format.store' => 'format',
            'format.show' => 'format',
            'format.edit' => 'format',
            'format.update' => 'format',
            'format.destroy' => 'format',

            // Inspecciones
            'inspection.index' => 'inspection',
            'inspection.create' => 'inspection',
            'inspection.store' => 'inspection',
            'inspection.show' => 'inspection',
            'inspection.edit' => 'inspection',
            'inspection.update' => 'inspection',
            'inspection.destroy' => 'inspection',

            // Configuración
            'settings.general.index' => 'settings.general',
            'settings.general.create' => 'settings.general',
            'settings.general.store' => 'settings.general',
            'settings.general.show' => 'settings.general',
            'settings.general.edit' => 'settings.general',
            'settings.general.update' => 'settings.general',
            'settings.general.destroy' => 'settings.general',

            // Personal
            'contrata.personal.index' => 'contrata.personal',
            'contrata.personal.create' => 'contrata.personal',
            'contrata.personal.store' => 'contrata.personal',
            'contrata.personal.show' => 'contrata.personal',
            'contrata.personal.edit' => 'contrata.personal',
            'contrata.personal.update' => 'contrata.personal',
            'contrata.personal.destroy' => 'contrata.personal',

            // Ingeniero de Seguridad
            'admin.security-engineer.index' => 'admin.security-engineer',
            'admin.security-engineer.create' => 'admin.security-engineer',
            'admin.security-engineer.store' => 'admin.security-engineer',
            'admin.security-engineer.show' => 'admin.security-engineer',
            'admin.security-engineer.edit' => 'admin.security-engineer',
            'admin.security-engineer.update' => 'admin.security-engineer',
            'admin.security-engineer.destroy' => 'admin.security-engineer',

            // Roles
            'contrata.roles.index' => 'contrata.roles',
            'contrata.roles.create' => 'contrata.roles',
            'contrata.roles.store' => 'contrata.roles',
            'contrata.roles.show' => 'contrata.roles',
            'contrata.roles.edit' => 'contrata.roles',
            'contrata.roles.update' => 'contrata.roles',
            'contrata.roles.destroy' => 'contrata.roles',

            // Asignaciones
            'assignments.index' => 'assignments',
            'assignments.store' => 'assignments',
            'assignments.update' => 'assignments',
            'assignments.destroy' => 'assignments',
        ];

        return $routeMapping[$routeName] ?? null;
    }

    /**
     * Verificar si es un item restringido
     */
    private function isRestrictedItem(string $roleKey): bool
    {
        return isset($this->restrictedItems[$roleKey]);
    }

    /**
     * Redirigir al dashboard
     */
    private function redirectToDashboard(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'No tienes permisos para acceder a esta sección.',
                'redirect' => route('dashboard')
            ], 403);
        }

        return redirect()->route('dashboard')
            ->with('error', 'No tienes permisos para acceder a esta sección.');
    }
}

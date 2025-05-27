<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class OwnerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set appname based on the request domain
        $host = $request->getHost();
        $appname = match ($host) {
            'newgestionsst.cursso.digital' => 'GestionSST',
            'cuajonesst.cursso.digital'    => 'CuajoneSST',
            'localhost'                    => 'CuajoneSST',
            '127.0.0.1'                    => 'GestionSST',
            default                        => 'DefaultApp',
        };

        View::share('appname', $appname);

        return $next($request);
    }
}

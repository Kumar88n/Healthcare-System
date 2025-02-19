<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckAdminDocAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userData = Auth::user();

        if (!empty($userData)) {

            if (($userData['role'] == "admin") || (($userData['role'] == "doctor") && ($userData['approved_by_admin'] == "1"))) {

                return $next($request);
            }
        }

        return response()->json([
            'valid' => false,
            'message' => "Unauthorized",
            'data' => [],
        ], 401);
    }
}

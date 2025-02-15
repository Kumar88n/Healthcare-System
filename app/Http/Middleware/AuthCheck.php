<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AuthCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /**  Check if the call is an API call  */
        if ($request->is('api/*')) {

            /**  check if the user is not authenticated  */
            if (!Auth::guard('api')->check()) {

                /**  exempted routes  */
                $exceptArr = [
                    'api/login',
                    'api/register',
                ];

                /**  check if the current route is not in the exempted routes  */
                if (!in_array($request->path(), $exceptArr)) {

                    return response()->json([
                        'valid' => false,
                        'message' => "Unauthorized",
                        'data' => [],
                    ], 401);
                }
            }
        }

        return $next($request);
    }
}

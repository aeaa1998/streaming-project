<?php

namespace App\Http\Middleware;

use App\Http\Utils\AuthUtils;
use Closure;

class RedirectIfNotAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!in_array(4, AuthUtils::getPermissions())) {
            return redirect('/songs');
        }
        return $next($request);
    }
}

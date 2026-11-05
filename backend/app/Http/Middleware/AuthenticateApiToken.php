<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $plain = $request->bearerToken();
        $row = $plain
            ? ApiToken::with('user')->where('token', hash('sha256', $plain))->first()
            : null;

        if (! $row || ! $row->user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        Auth::setUser($row->user);
        $request->setUserResolver(fn () => $row->user);
        $request->attributes->set('api_token_id', $row->id);

        return $next($request);
    }
}

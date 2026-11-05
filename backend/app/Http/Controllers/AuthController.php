<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use App\Models\User;
use App\Support\CongressPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function __construct(private CongressPresenter $presenter) {}

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', Password::min(6)],
            'organization' => ['nullable', 'string', 'max:190'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'organization' => $data['organization'] ?? null,
            'phone' => null,
            'location' => 'Dubai, UAE',
            'role_title' => 'Attendee',
            'badge_role' => 'Attendee',
            'initials' => User::initialsFrom($data['name']),
            'sessions_count' => 0,
            'certificates_count' => 0,
        ]);
        $user->update(['badge_id' => 'NMC-2026-'.str_pad((string) $user->id, 3, '0', STR_PAD_LEFT)]);

        return response()->json($this->tokenResponse($user->fresh()), 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($data)) {
            return response()->json([
                'message' => 'Those details do not match an account.',
            ], 422);
        }

        /** @var User $user */
        $user = User::where('email', $data['email'])->firstOrFail();

        return response()->json($this->tokenResponse($user));
    }

    public function me(Request $request)
    {
        return response()->json($this->presenter->user($request->user()));
    }

    public function logout(Request $request)
    {
        ApiToken::where('id', $request->attributes->get('api_token_id'))->delete();

        return response()->json(['message' => 'Signed out.']);
    }

    public function forgot(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $data['email'])->first();
        if (! $user) {
            return response()->json([
                'message' => 'No account uses that email.',
            ], 422);
        }

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => hash('sha256', Str::random(40)), 'created_at' => now()]
        );

        return response()->json([
            'message' => 'A reset request is saved for '.$user->email.'.',
        ]);
    }

    private function tokenResponse(User $user): array
    {
        $plain = Str::random(48);
        ApiToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $plain),
        ]);

        return [
            'token' => $plain,
            'user' => $this->presenter->user($user),
        ];
    }
}

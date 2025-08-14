<?php

namespace App\Http\Controllers;

use App\Modules\User\Models\User;   // ✅ burası önemli
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    const INCORRECT_CREDENTIALS = 'The provided credentials are incorrect.';

    protected function generateToken(User $user)
    {
        return $user->createToken('auth_token')->plainTextToken;
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => self::INCORRECT_CREDENTIALS,
                'error_code' => 'AUTH_INVALID_CREDENTIALS',
            ], 401);
        }

        $token = $this->generateToken($user);

        return response()->json([
            'token' => $token,
            'user'  => $user->only(['id','name','surname','phone_number','email','status','role']),
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            // sadece mevcut token'ı silmek istersen:
            $request->user()->currentAccessToken()?->delete();

            // veya tüm tokenlar:
            // $user->tokens()->delete();
        }
        return response()->json(null, 204);
    }

    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:users,phone_number',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|string',
        ]);
        if ($v->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $v->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ?? 'user',
        ]);

        $token = $this->generateToken($user);

        return response()->json(['message' => 'Registration successful', 'user' => $user, 'token' => $token], 201);
    }

    public function forgotPassword(Request $request)
    {
        $v = Validator::make($request->all(), ['email' => 'required|email']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'Email not found'], 404);

        $token = Str::random(60);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => now()]
        );

        $resetUrl = env('APP_URL') . '/Kullanici/SifreyiSifirla?token=' . $token . '&email=' . urlencode($user->email);

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset link has been sent to your email.',
            'email_content' => [
                'subject' => 'Şifre Sıfırlama Talebi',
                'message' => 'Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:',
                'reset_link' => $resetUrl,
            ],
        ]);
    }

    public function resetPassword(Request $request)
    {
        $v = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|confirmed|min:8',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = $request->user();
        if (!$user || !Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mevcut şifre yanlış'], 401);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(null, 204);
    }

    public function resetPasswordWithToken(Request $request)
    {
        $v = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $rec = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$rec) return response()->json(['message' => 'Geçersiz token'], 400);

        if (Carbon::parse($rec->created_at)->diffInHours(now()) > 1) {
            return response()->json(['message' => 'Token süresi dolmuş'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'Email not found'], 404);

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['status' => 'success', 'message' => 'Şifre sıfırlandı.']);
    }

    public function refreshToken(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $request->user()->currentAccessToken()?->delete();
        $new = $this->generateToken($user);

        return response()->json([
            'token' => $new,
            'user'  => $user->only(['id','name','surname','phone_number','email','status','role']),
            'message' => 'Token refreshed successfully'
        ]);
    }
}

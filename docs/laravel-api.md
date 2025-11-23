# LaundryKita Laravel API Guide

This guide shows how to create a lightweight Laravel API that works with the React Native login flow (`lib/auth.ts`). It covers installing Laravel, configuring authentication with Sanctum, and exposing `/api/login` and `/api/logout` endpoints.

## 1. Create the Laravel project

```bash
composer create-project laravel/laravel laundrykita-api
cd laundrykita-api
cp .env.example .env
php artisan key:generate
```

Configure the database in `.env` (e.g., MySQL) and run migrations:

```bash
php artisan migrate
```

## 2. Install Sanctum for API tokens

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

Add Sanctum middleware to `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

## 3. Seed a demo user

Use a seeder to create an initial owner/employee account:

```php
php artisan make:seeder DemoUserSeeder
```

```php
// database/seeders/DemoUserSeeder.php
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'owner@laundrykita.test'],
            [
                'name' => 'Owner LaundryKita',
                'password' => Hash::make('password'),
            ],
        );
    }
}
```

Register the seeder inside `DatabaseSeeder` and run `php artisan db:seed`.

## 4. Build an authentication controller

```bash
php artisan make:controller Api/AuthController
php artisan make:request Api/LoginRequest
```

```php
// app/Http/Requests/Api/LoginRequest.php
namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }
}
```

```php
// app/Http/Controllers/Api/AuthController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email atau password salah'], 422);
        }

        $user = $request->user();
        $token = $user->createToken('laundrykita-mobile')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil']);
    }
}
```

## 5. Define the API routes

```php
// routes/api.php
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
```

## 6. Test the API

```bash
php artisan serve --host=0.0.0.0 --port=8000
curl -X POST http://localhost:8000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"owner@laundrykita.test","password":"password"}'
```

The response should match the shape expected by `lib/auth.ts`. Use `Bearer {token}` for authenticated endpoints.

## 7. Connect the Expo app

1. Create a `.env` file in the Expo project root and add:
   ```ini
   EXPO_PUBLIC_API_URL=http://192.168.1.10:8000/api
   ```
   (replace with the LAN IP of your Laravel server).
2. Restart Metro: `npx expo start -c`.
3. Use the login form (email/password) to authenticate; successful sign-in returns the user and token which you can store with SecureStore/AsyncStorage.

## 8. Next steps

- Add registration endpoints mirroring the register screen.
- Use Laravel Policies/Roles to distinguish `pemilik` vs `pegawai`.
- Protect additional resources with Sanctum middleware and tokens stored in the mobile app.

This setup keeps the React Native client and Laravel backend aligned, enabling secure authentication and future APIs for orders, tracking, etc.

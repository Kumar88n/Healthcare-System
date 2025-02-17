<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:patient,doctor',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            if ($user) {
                $this->apiValid = true;
                $this->apiMessage = "User created successfully";
            } else {
                $this->apiMessage = "Error creating new User";
            }
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {
            $token = JWTAuth::attempt($request->only('email', 'password'));

            if (!$token) {
                $this->apiMessage = "Unauthorized";
            } else {
                $this->apiValid = true;
                $this->apiMessage = "User logged in successfully";
                $this->apiData = [
                    'token' => $token,
                ];
            }
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function getUserData()
    {
        $userData = Auth::user();

        if (!empty($userData)) {
            $this->apiValid = true;
            $this->apiMessage = "User Data returned successfully";
            $this->apiData = [
                'userData' => $userData,
            ];
        } else {
            $this->apiMessage = "Unauthorized";
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            $this->apiValid = true;
            $this->apiMessage = "User logged out successfully";
        } catch (\Throwable $e) {
            $this->apiMessage = "Something went wrong. Please try again later";
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }
}

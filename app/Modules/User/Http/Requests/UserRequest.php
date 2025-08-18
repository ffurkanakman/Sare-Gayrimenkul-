<?php

namespace App\Modules\User\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        if ($this->isMethod('post')) {
            return [
                'name' => ['required', 'string', 'max:255'],
                'surname' => ['required', 'string', 'max:255'],
                'phone_number' => ['required', 'string', 'max:20', 'unique:users,phone_number'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
                'role' => ['nullable', 'string'],
                'pic'  => ['nullable','image','mimes:jpg,jpeg,png,webp','max:2048'],
                'status' => ['sometimes','boolean'],
            ];
        }

        // PUT veya PATCH - alanlar opsiyonel ama gelen varsa doğrulanır
        $userId = $this->route('id') ?? auth()->id();

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'surname' => ['sometimes', 'string', 'max:255'],
            'phone_number' => ['sometimes', 'string', 'max:20', 'unique:users,phone_number,' . $userId],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'role' => ['sometimes', 'string'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
            'status' => ['sometimes','boolean'],
            // 👇 güncellemede resim & silme
            'pic'          => ['sometimes','nullable','image','mimes:jpg,jpeg,png,webp','max:2048'],
            'remove_pic'   => ['sometimes','boolean'],
        ];
    }
}

<?php

namespace App\Modules\Client\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        return [
            'company_name'      => ['required', 'string', 'max:255'],
            'authorized_person' => ['required', 'string', 'max:255'],
            'phone'             => ['nullable', 'string', 'max:20'],
            'address'           => ['nullable', 'string'],
            'email'             => ['nullable', 'email', 'max:255'],
        ];
    }
}

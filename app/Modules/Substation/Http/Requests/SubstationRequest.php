<?php

namespace App\Modules\Substation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubstationRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
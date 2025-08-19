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
            'company_name'         => [$this->isMethod('post') ? 'required' : 'sometimes','string','max:255'],
            // Eğer dosya yükleyeceksen:
             'cover_image' => ['sometimes','nullable','image','mimes:jpg,jpeg,png,webp','max:5120'],
        ];
    }
}

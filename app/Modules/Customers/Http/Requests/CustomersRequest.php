<?php

namespace App\Modules\Customers\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomersRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'phone_number' => ['required', 'string', 'regex:/^\(\d{3}\) \d{3} \d{2} \d{2}$/'],
            'description' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'Müşteri adı soyadı zorunludur',
            'name.min' => 'Müşteri adı en az :min karakter olmalıdır',
            'phone_number.required' => 'Telefon numarası zorunludur',
            'phone_number.regex' => 'Geçerli bir telefon numarası giriniz',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // No preparation needed for validation
    }

    /**
     * Handle a passed validation attempt.
     *
     * @return void
     */
    protected function passedValidation()
    {
        $this->replace($this->transformValidatedData());
    }

    /**
     * Transform the validated data to match the database structure.
     *
     * @return array
     */
    protected function transformValidatedData()
    {
        $validated = $this->validated();

        // Split the full name into name and surname
        $nameParts = explode(' ', $validated['name'], 2);
        $name = $nameParts[0];
        $surname = isset($nameParts[1]) ? $nameParts[1] : '';

        // Transform the data to match the database structure
        $transformed = [
            'name' => $name,
            'surname' => $surname,
            'phone_number' => $validated['phone_number'],
        ];

        // Add description if it exists
        if (isset($validated['description'])) {
            $transformed['description'] = $validated['description'];
        }

        return $transformed;
    }
}

<?php

namespace App\Modules\Customers\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Modules\Customers\Enums\StatusEnum;
use Illuminate\Support\Str;

class CustomersResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'manager_info' => $this->getManagerInfo(),
            'name' => $this->name,
            'phone_number' => $this->phone_number,
            'description' => Str::limit($this->description, 100),
            'status' => [
                'value' => $this->status?->value,
                'label' => $this->status?->label(),
                'badge' => $this->status?->badge(),
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}

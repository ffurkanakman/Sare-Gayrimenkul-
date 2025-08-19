<?php

namespace App\Modules\Substation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubstationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'cover_image' => $this->cover_image,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}

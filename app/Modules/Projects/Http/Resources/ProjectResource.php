<?php

namespace App\Modules\Projects\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'machine_info' => $this->machine_info,
            'project_type' => $this->project_type,
            'price' => $this->price,
            'labor_cost' => $this->labor_cost, // ✅ işçilik
            'discount' => $this->discount,     // ✅ iskonto
            'debt' => $this->debt,             // ✅ borç
            'status' => $this->status,
            'notes' => $this->notes,
            'done_jobs' => $this->done_jobs,

            'client' => $this->when($this->client, function () {
                return [
                    'id' => $this->client->id,
                    'company_name' => $this->client->company_name,
                    'phone' => $this->client->phone,
                    'email' => $this->client->email,
                    'authorized_person' => $this->client->authorized_person,
                ];
            }),

            'sales_person' => $this->when($this->salesPerson, function () {
                return [
                    'id' => $this->salesPerson->id,
                    'name' => $this->salesPerson->name,
                    'phone_number' => $this->salesPerson->phone_number,
                    'email' => $this->salesPerson->email,
                ];
            }),

            'vehicle_information' => $this->when($this->vehicleInformation, function () {
                return [
                    'id' => $this->vehicleInformation->id,
                    'brand' => $this->vehicleInformation->brand,
                    'model' => $this->vehicleInformation->model,
                    'serial_number' => $this->vehicleInformation->serial_number,
                    'chassis_number' => $this->vehicleInformation->chassis_number,
                    'hours' => $this->vehicleInformation->hours,
                    'model_year' => $this->vehicleInformation->model_year,
                    'photos' => $this->vehicleInformation->photos,
                ];
            }),

            'parts' => $this->when($this->parts, function () {
                return $this->parts->map(function ($part) {
                    return [
                        'id' => $part->id,
                        'name' => $part->name,
                        'quantity' => $part->quantity,
                        'unit_price' => $part->unit_price,
                        'total_price' => $part->total_price,
                    ];
                });
            }),

            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}

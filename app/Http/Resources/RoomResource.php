<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'office_id' => $this->office_id,
            'name' => $this->name,
            'capacity' => $this->capacity,
            'type' => $this->type,
            'is_active' => $this->is_active,
            'description' => $this->description,
            'amenities' => AmenityResource::collection($this->whenLoaded('amenities')),
            'working_hours' => $this->whenLoaded('workingHours'),
            'closures' => $this->whenLoaded('closures'),
        ];
    }
}

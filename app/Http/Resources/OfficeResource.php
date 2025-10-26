<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'timezone' => $this->timezone,
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'working_hours' => $this->whenLoaded('workingHours'),
            'closures' => $this->whenLoaded('closures'),
        ];
    }
}

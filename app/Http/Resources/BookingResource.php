<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'room' => RoomResource::make($this->whenLoaded('room')),
            'user_id' => $this->user_id,
            'starts_at' => $this->starts_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'attendee_count' => $this->attendee_count,
            'status' => $this->status,
            'title' => $this->title,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'attendees' => $this->whenLoaded('attendees'),
        ];
    }
}

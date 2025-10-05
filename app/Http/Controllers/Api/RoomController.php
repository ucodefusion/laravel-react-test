<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $rooms = Room::query()
            ->with(['amenities', 'office'])
            ->when($request->filled('office_id'), fn($query) => $query->where('office_id', $request->office_id))
            ->when($request->filled('capacity'), fn($query) => $query->where('capacity', '>=', $request->capacity))
            ->paginate(10);

        return RoomResource::collection($rooms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'office_id' => 'required|exists:offices,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'type' => 'required|string',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'amenity_ids' => 'array',
            'amenity_ids.*' => 'exists:amenities,id',
        ]);

        $amenityIds = $validated['amenity_ids'] ?? [];
        unset($validated['amenity_ids']);

        $room = Room::create($validated);
        if (!empty($amenityIds)) {
            $room->amenities()->sync($amenityIds);
        }

        return new RoomResource($room->load('amenities'));
    }

    public function show(Room $room)
    {
        $room->load(['amenities', 'workingHours', 'closures', 'office']);

        return new RoomResource($room);
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'capacity' => 'sometimes|required|integer|min:1',
            'type' => 'sometimes|required|string',
            'is_active' => 'sometimes|boolean',
            'description' => 'nullable|string',
            'amenity_ids' => 'array',
            'amenity_ids.*' => 'exists:amenities,id',
        ]);

        $amenityIds = $validated['amenity_ids'] ?? null;
        unset($validated['amenity_ids']);

        $room->update($validated);
        if (is_array($amenityIds)) {
            $room->amenities()->sync($amenityIds);
        }

        return new RoomResource($room->load('amenities'));
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->noContent();
    }
}

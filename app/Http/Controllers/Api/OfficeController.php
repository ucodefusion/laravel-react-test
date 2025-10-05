<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OfficeResource;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OfficeController extends Controller
{
    public function index(Request $request)
    {
        $offices = Office::with(['rooms', 'workingHours', 'closures'])->paginate(10);

        return OfficeResource::collection($offices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'timezone' => 'required|string',
        ]);

        $office = Office::create($validated);

        return new OfficeResource($office);
    }

    public function show(Office $office)
    {
        $office->load(['rooms.amenities', 'rooms.workingHours', 'rooms.closures', 'workingHours', 'closures']);

        return new OfficeResource($office);
    }

    public function update(Request $request, Office $office)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:500',
            'timezone' => 'sometimes|required|string',
        ]);

        $office->update($validated);

        return new OfficeResource($office);
    }

    public function destroy(Office $office)
    {
        $office->delete();

        return response()->noContent();
    }
}

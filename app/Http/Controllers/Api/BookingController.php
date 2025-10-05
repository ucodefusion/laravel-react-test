<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BookingController extends Controller
{
    public function __construct(private BookingService $service)
    {
    }

    public function index(Request $request)
    {
        $query = Booking::with(['room.amenities', 'attendees'])
            ->when(!$request->user()->can('booking.manage.any'), function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })
            ->when($request->filled('room_id'), fn($q) => $q->where('room_id', $request->room_id))
            ->orderByDesc('starts_at');

        return BookingResource::collection($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date',
            'attendee_count' => 'required|integer|min:1',
            'title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $booking = $this->service->create(
            $validated['room_id'],
            $request->user()->id,
            Carbon::parse($validated['starts_at']),
            Carbon::parse($validated['ends_at']),
            $validated['attendee_count'],
            $validated['title'] ?? null,
            $validated['notes'] ?? null
        );

        return new BookingResource($booking->load(['room.amenities']));
    }

    public function show(Booking $booking)
    {
        Gate::authorize('view', $booking);

        return new BookingResource($booking->load(['room.amenities', 'attendees']));
    }

    public function update(Request $request, Booking $booking)
    {
        Gate::authorize('update', $booking);

        $validated = $request->validate([
            'starts_at' => 'sometimes|required|date',
            'ends_at' => 'sometimes|required|date',
            'attendee_count' => 'sometimes|required|integer|min:1',
            'title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $updated = $this->service->update($booking, $validated);

        return new BookingResource($updated->load(['room.amenities', 'attendees']));
    }

    public function destroy(Booking $booking)
    {
        Gate::authorize('delete', $booking);

        $this->service->cancel($booking);

        return response()->noContent();
    }
}

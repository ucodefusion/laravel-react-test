<?php

namespace App\Services\Booking;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class BookingOverlapGuard
{
    public function lock(int $roomId, Carbon $startsAt, Carbon $endsAt, ?int $ignoreBookingId = null): void
    {
        $query = Booking::where('room_id', $roomId)
            ->where(function ($query) use ($startsAt, $endsAt) {
                $query->where('ends_at', '>', $startsAt)
                    ->where('starts_at', '<', $endsAt);
            });

        if ($ignoreBookingId) {
            $query->where('id', '!=', $ignoreBookingId);
        }

        $query->lockForUpdate()->get();
    }

    public function assertAvailability(int $roomId, Carbon $startsAt, Carbon $endsAt, ?int $ignoreBookingId = null): void
    {
        $overlap = Booking::where('room_id', $roomId)
            ->where('status', '!=', 'cancelled')
            ->when($ignoreBookingId, fn($query) => $query->where('id', '!=', $ignoreBookingId))
            ->where(function ($query) use ($startsAt, $endsAt) {
                $query->whereBetween('starts_at', [$startsAt, $endsAt])
                    ->orWhereBetween('ends_at', [$startsAt, $endsAt])
                    ->orWhere(function ($inner) use ($startsAt, $endsAt) {
                        $inner->where('starts_at', '<=', $startsAt)
                            ->where('ends_at', '>=', $endsAt);
                    });
            })
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages(['starts_at' => 'Room already booked for this time.']);
        }
    }
}

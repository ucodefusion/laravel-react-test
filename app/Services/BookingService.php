<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use App\Models\ScheduleClosure;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function create(
        int $roomId,
        int $userId,
        Carbon $startsAt,
        Carbon $endsAt,
        int $attendeeCount = 1,
        ?string $title = null,
        ?string $notes = null
    ): Booking {
        $room = Room::findOrFail($roomId);
        $this->validateRange($room, $startsAt, $endsAt, $attendeeCount);

        return DB::transaction(function () use ($room, $userId, $startsAt, $endsAt, $attendeeCount, $title, $notes) {
            $this->lockExistingBookings($room->id, $startsAt, $endsAt);
            $this->ensureNoOverlap($room->id, $startsAt, $endsAt);

            $booking = Booking::create([
                'room_id' => $room->id,
                'user_id' => $userId,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'attendee_count' => $attendeeCount,
                'status' => 'confirmed',
                'title' => $title,
                'notes' => $notes,
            ]);

            Event::dispatch('booking.created', $booking);

            return $booking;
        });
    }

    public function update(Booking $booking, array $payload): Booking
    {
        $startsAt = Carbon::parse($payload['starts_at'] ?? $booking->starts_at);
        $endsAt = Carbon::parse($payload['ends_at'] ?? $booking->ends_at);
        $attendeeCount = $payload['attendee_count'] ?? $booking->attendee_count;

        $this->validateRange($booking->room, $startsAt, $endsAt, $attendeeCount, $booking->id);

        return DB::transaction(function () use ($booking, $payload, $startsAt, $endsAt, $attendeeCount) {
            $this->lockExistingBookings($booking->room_id, $startsAt, $endsAt, $booking->id);
            $this->ensureNoOverlap($booking->room_id, $startsAt, $endsAt, $booking->id);

            $booking->fill([
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'attendee_count' => $attendeeCount,
                'title' => $payload['title'] ?? $booking->title,
                'notes' => $payload['notes'] ?? $booking->notes,
            ])->save();

            Event::dispatch('booking.updated', $booking);

            return $booking->refresh();
        });
    }

    public function cancel(Booking $booking): Booking
    {
        $booking->update(['status' => 'cancelled']);
        Event::dispatch('booking.cancelled', $booking);

        return $booking;
    }

    protected function validateRange(Room $room, Carbon $startsAt, Carbon $endsAt, int $attendeeCount, ?int $ignoreBookingId = null): void
    {
        if ($startsAt >= $endsAt) {
            throw ValidationException::withMessages(['ends_at' => 'End time must be after start time.']);
        }

        $duration = $startsAt->diffInMinutes($endsAt);
        if ($duration < config('booking.min_duration_minutes') || $duration > config('booking.max_duration_minutes')) {
            throw ValidationException::withMessages(['duration' => 'Booking duration is outside allowed range.']);
        }

        if ($attendeeCount < 1 || $attendeeCount > $room->capacity) {
            throw ValidationException::withMessages(['attendee_count' => 'Attendee count exceeds room capacity.']);
        }

        $weekday = $startsAt->dayOfWeekIso;
        $workingHour = $room->workingHours()->where('weekday', $weekday)->first()
            ?? $room->office->workingHours()->where('weekday', $weekday)->first();

        if (!$workingHour) {
            throw ValidationException::withMessages(['starts_at' => 'Room is not available on the selected day.']);
        }

        $openAt = Carbon::parse($workingHour->open_at, $workingHour->timezone ?? $room->office->timezone)
            ->setDate($startsAt->year, $startsAt->month, $startsAt->day);
        $closeAt = Carbon::parse($workingHour->close_at, $workingHour->timezone ?? $room->office->timezone)
            ->setDate($startsAt->year, $startsAt->month, $startsAt->day);

        if ($startsAt->lt($openAt) || $endsAt->gt($closeAt)) {
            throw ValidationException::withMessages(['starts_at' => 'Time outside working hours.']);
        }

        $closure = $room->closures()
            ->whereDate('closed_on', $startsAt->toDateString())
            ->exists() || $room->office->closures()->whereDate('closed_on', $startsAt->toDateString())->exists();

        if ($closure) {
            throw ValidationException::withMessages(['starts_at' => 'Room is closed on the selected date.']);
        }
    }

    protected function ensureNoOverlap(int $roomId, Carbon $startsAt, Carbon $endsAt, ?int $ignoreBookingId = null): void
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

    protected function lockExistingBookings(int $roomId, Carbon $startsAt, Carbon $endsAt, ?int $ignoreBookingId = null): void
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
}

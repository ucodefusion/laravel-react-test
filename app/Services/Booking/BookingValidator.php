<?php

namespace App\Services\Booking;

use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class BookingValidator
{
    public function validate(Room $room, Carbon $startsAt, Carbon $endsAt, int $attendeeCount): void
    {
        if ($startsAt >= $endsAt) {
            throw ValidationException::withMessages(['ends_at' => 'End time must be after start time.']);
        }

        $duration = $startsAt->diffInMinutes($endsAt);
        $minDuration = (int) config('booking.min_duration_minutes');
        $maxDuration = (int) config('booking.max_duration_minutes');

        if ($duration < $minDuration || $duration > $maxDuration) {
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

        $timezone = $workingHour->timezone ?? $room->office->timezone;
        $openAt = Carbon::parse($workingHour->open_at, $timezone)
            ->setDate($startsAt->year, $startsAt->month, $startsAt->day);
        $closeAt = Carbon::parse($workingHour->close_at, $timezone)
            ->setDate($startsAt->year, $startsAt->month, $startsAt->day);

        if ($startsAt->lt($openAt) || $endsAt->gt($closeAt)) {
            throw ValidationException::withMessages(['starts_at' => 'Time outside working hours.']);
        }

        $isClosed = $room->closures()->whereDate('closed_on', $startsAt->toDateString())->exists()
            || $room->office->closures()->whereDate('closed_on', $startsAt->toDateString())->exists();

        if ($isClosed) {
            throw ValidationException::withMessages(['starts_at' => 'Room is closed on the selected date.']);
        }
    }
}

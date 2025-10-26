<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function show(Request $request, Room $room)
    {
        $date = Carbon::parse($request->query('date', now()->toDateString()));
        $weekday = $date->dayOfWeekIso;

        $workingHour = $room->workingHours()->where('weekday', $weekday)->first()
            ?? $room->office->workingHours()->where('weekday', $weekday)->first();

        if (!$workingHour) {
            return response()->json([
                'slots' => [],
                'message' => 'Room unavailable on this date.',
            ]);
        }

        $openAt = Carbon::parse($workingHour->open_at, $workingHour->timezone ?? $room->office->timezone)
            ->setDate($date->year, $date->month, $date->day);
        $closeAt = Carbon::parse($workingHour->close_at, $workingHour->timezone ?? $room->office->timezone)
            ->setDate($date->year, $date->month, $date->day);

        $existing = Booking::where('room_id', $room->id)
            ->where('status', '!=', 'cancelled')
            ->whereDate('starts_at', $date)
            ->get();

        $cursor = $openAt->clone();
        $slots = [];
        $increment = config('booking.min_duration_minutes');

        while ($cursor->lt($closeAt)) {
            $end = $cursor->copy()->addMinutes($increment);
            if ($end->gt($closeAt)) {
                break;
            }

            $overlap = $existing->first(function ($booking) use ($cursor, $end) {
                return !($booking->ends_at <= $cursor || $booking->starts_at >= $end);
            });

            if (!$overlap) {
                $slots[] = [
                    'starts_at' => $cursor->toIso8601String(),
                    'ends_at' => $end->toIso8601String(),
                ];
            }

            $cursor->addMinutes($increment);
        }

        return response()->json([
            'slots' => $slots,
        ]);
    }
}

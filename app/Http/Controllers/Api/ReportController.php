<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function utilization(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'nullable|exists:rooms,id',
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($validated['from']);
        $to = Carbon::parse($validated['to']);

        $query = Booking::select([
            'room_id',
            DB::raw('DATE(starts_at) as day'),
            DB::raw('SUM(TIMESTAMPDIFF(MINUTE, starts_at, ends_at)) as booked_minutes'),
        ])
            ->where('status', '!=', 'cancelled')
            ->whereBetween('starts_at', [$from, $to])
            ->groupBy('room_id', DB::raw('DATE(starts_at)'));

        if (!empty($validated['room_id'])) {
            $query->where('room_id', $validated['room_id']);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data,
        ]);
    }
}

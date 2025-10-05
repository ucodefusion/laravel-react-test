<?php

return [
    'min_duration_minutes' => (int) env('BOOKING_MIN_DURATION_MIN', 30),
    'max_duration_minutes' => (int) env('BOOKING_MAX_DURATION_MIN', 480),
    'reminder_minutes' => (int) env('BOOKING_REMINDER_MINUTES', 30),
];

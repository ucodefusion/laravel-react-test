<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return $user->can('booking.manage.any') || $booking->user_id === $user->id;
    }

    public function update(User $user, Booking $booking): bool
    {
        return $user->can('booking.manage.any') || $booking->user_id === $user->id;
    }

    public function delete(User $user, Booking $booking): bool
    {
        return $user->can('booking.manage.any') || $booking->user_id === $user->id;
    }

    public function manageAny(User $user): bool
    {
        return $user->can('booking.manage.any');
    }
}

<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $startsAt = $this->faker->dateTimeBetween('+1 day', '+2 days');

        return [
            'room_id' => Room::factory(),
            'user_id' => User::factory(),
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->modify('+1 hour'),
            'attendee_count' => $this->faker->numberBetween(1, 5),
            'status' => 'confirmed',
            'title' => $this->faker->sentence(3),
            'notes' => $this->faker->sentence(),
        ];
    }
}

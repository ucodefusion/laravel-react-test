<?php

namespace Database\Factories;

use App\Models\Office;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        return [
            'office_id' => Office::factory(),
            'name' => $this->faker->colorName().' Room',
            'capacity' => $this->faker->numberBetween(2, 12),
            'type' => 'meeting_room',
            'is_active' => true,
            'description' => $this->faker->sentence(),
        ];
    }
}

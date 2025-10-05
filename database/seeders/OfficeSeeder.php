<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\Office;
use App\Models\Room;
use App\Models\WorkingHour;
use Illuminate\Database\Seeder;

class OfficeSeeder extends Seeder
{
    public function run(): void
    {
        $office = Office::firstOrCreate([
            'name' => 'Downtown HQ',
        ], [
            'address' => '123 Main Street',
            'timezone' => 'Pacific/Auckland',
        ]);

        $amenities = collect([
            ['name' => 'Projector', 'icon' => 'video-camera'],
            ['name' => 'Whiteboard', 'icon' => 'clipboard'],
            ['name' => 'Conference Phone', 'icon' => 'phone'],
        ])->map(fn($data) => Amenity::firstOrCreate(['name' => $data['name']], $data));

        $room = Room::firstOrCreate([
            'office_id' => $office->id,
            'name' => 'Kauri Room',
        ], [
            'capacity' => 10,
            'type' => 'meeting_room',
            'description' => 'Large meeting room with video conferencing.',
        ]);

        $room->amenities()->sync($amenities->pluck('id'));

        foreach (range(1, 5) as $weekday) {
            WorkingHour::firstOrCreate([
                'workable_type' => Office::class,
                'workable_id' => $office->id,
                'weekday' => $weekday,
            ], [
                'open_at' => '08:00',
                'close_at' => '18:00',
                'timezone' => $office->timezone,
            ]);
        }
    }
}

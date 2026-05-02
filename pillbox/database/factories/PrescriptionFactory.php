<?php

namespace Database\Factories;

use App\Models\Medication;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PrescriptionFactory extends Factory
{
    public function definition(): array
    {
        $schedules = fake()->randomElements(['08:00', '12:00', '14:00', '20:00', '22:00'], fake()->numberBetween(1, 3));
        sort($schedules);

        return [
            'resident_id'   => Resident::factory(),
            'medication_id' => Medication::factory(),
            'user_id'       => User::factory()->state(['role' => 'medico']),
            'dose'          => fake()->randomElement(['1 comprimido', '2 comprimidos', '5 ml', '1 cápsula']),
            'route'         => fake()->randomElement(['oral', 'sublingual', 'tópica']),
            'schedules'     => $schedules,
            'start_date'    => now()->subDays(fake()->numberBetween(1, 30))->format('Y-m-d'),
            'end_date'      => null,
            'notes'         => null,
            'active'        => true,
        ];
    }
}

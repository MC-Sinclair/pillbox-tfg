<?php

namespace Database\Factories;

use App\Models\Residence;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResidentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name'   => fake()->firstName(),
            'last_name'    => fake()->lastName() . ' ' . fake()->lastName(),
            'birth_date'   => fake()->dateTimeBetween('-95 years', '-65 years')->format('Y-m-d'),
            'room'         => (string) fake()->numberBetween(1, 50),
            'photo'        => null,
            'doctor'       => 'Dr. ' . fake()->lastName(),
            'status'       => 'active',
            'residence_id' => Residence::factory(),
        ];
    }
}

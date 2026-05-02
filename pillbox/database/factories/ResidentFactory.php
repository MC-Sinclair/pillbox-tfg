<?php

namespace Database\Factories;

use App\Models\Residence;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResidentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name'   => $this->faker->firstName(),
            'last_name'    => $this->faker->lastName() . ' ' . $this->faker->lastName(),
            'birth_date'   => $this->faker->dateTimeBetween('-95 years', '-65 years')->format('Y-m-d'),
            'room'         => (string) $this->faker->numberBetween(1, 50),
            'photo'        => null,
            'doctor'       => 'Dr. ' . $this->faker->lastName(),
            'status'       => 'active',
            'residence_id' => Residence::factory(),
        ];
    }
}

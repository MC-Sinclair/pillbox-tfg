<?php

namespace Database\Factories;

use App\Models\Residence;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResidentFactory extends Factory
{
    public function definition(): array
    {
        $faker = $this->withFaker();

        return [
            'first_name'   => $faker->firstName(),
            'last_name'    => $faker->lastName() . ' ' . $faker->lastName(),
            'birth_date'   => $faker->dateTimeBetween('-95 years', '-65 years')->format('Y-m-d'),
            'room'         => (string) $faker->numberBetween(1, 50),
            'photo'        => null,
            'doctor'       => 'Dr. ' . $faker->lastName(),
            'status'       => 'active',
            'residence_id' => Residence::factory(),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ResidenceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'     => 'Residencia ' . fake()->lastName(),
            'address'  => fake()->streetAddress(),
            'city'     => fake()->city(),
            'zip_code' => fake()->postcode(),
            'phone'    => fake()->phoneNumber(),
        ];
    }
}

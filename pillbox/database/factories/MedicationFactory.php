<?php

namespace Database\Factories;

use App\Models\Residence;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicationFactory extends Factory
{
    private static array $medications = [
        ['name' => 'Paracetamol', 'brand' => 'Gelocatil', 'active_ingredient' => 'Paracetamol', 'format' => 'tablet'],
        ['name' => 'Ibuprofeno', 'brand' => 'Neobrufen', 'active_ingredient' => 'Ibuprofeno', 'format' => 'tablet'],
        ['name' => 'Omeprazol', 'brand' => 'Losec', 'active_ingredient' => 'Omeprazol', 'format' => 'capsule'],
        ['name' => 'Enalapril', 'brand' => 'Renitec', 'active_ingredient' => 'Enalapril', 'format' => 'tablet'],
        ['name' => 'Lorazepam', 'brand' => 'Orfidal', 'active_ingredient' => 'Lorazepam', 'format' => 'tablet'],
        ['name' => 'Amoxicilina', 'brand' => 'Amoxicilina Kern', 'active_ingredient' => 'Amoxicilina', 'format' => 'capsule'],
        ['name' => 'Metformina', 'brand' => 'Dianben', 'active_ingredient' => 'Metformina', 'format' => 'tablet'],
        ['name' => 'Furosemida', 'brand' => 'Seguril', 'active_ingredient' => 'Furosemida', 'format' => 'tablet'],
    ];

    public function definition(): array
    {
        $med = fake()->randomElement(self::$medications);

        return [
            'name'             => $med['name'],
            'brand'            => $med['brand'],
            'active_ingredient'=> $med['active_ingredient'],
            'format'           => $med['format'],
            'description'      => null,
            'residence_id'     => Residence::factory(),
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\Medication;
use App\Models\Prescription;
use App\Models\Residence;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $residence = Residence::create([
            'name'     => 'Residencia Los Pinos',
            'address'  => 'Calle Mayor, 12',
            'city'     => 'Segovia',
            'zip_code' => '40001',
            'phone'    => '921 000 000',
        ]);

        User::create([
            'name'         => 'Admin',
            'email'        => 'admin@pillbox.com',
            'password'     => Hash::make('password'),
            'role'         => 'admin',
            'active'       => true,
            'residence_id' => $residence->id,
        ]);

        $medico = User::create([
            'name'         => 'Dr. García',
            'email'        => 'medico@pillbox.com',
            'password'     => Hash::make('password'),
            'role'         => 'medico',
            'active'       => true,
            'residence_id' => $residence->id,
        ]);

        User::create([
            'name'         => 'Ana Gómez',
            'email'        => 'gerocultora1@pillbox.com',
            'password'     => Hash::make('password'),
            'role'         => 'gerocultora',
            'active'       => true,
            'residence_id' => $residence->id,
        ]);

        User::create([
            'name'         => 'Laura Martín',
            'email'        => 'gerocultora2@pillbox.com',
            'password'     => Hash::make('password'),
            'role'         => 'gerocultora',
            'active'       => true,
            'residence_id' => $residence->id,
        ]);

        $residents = Resident::factory(8)->create(['residence_id' => $residence->id]);

        $medications = collect([
            ['name' => 'Paracetamol',  'brand' => 'Gelocatil',        'active_ingredient' => 'Paracetamol',  'format' => 'tablet'],
            ['name' => 'Omeprazol',    'brand' => 'Losec',             'active_ingredient' => 'Omeprazol',    'format' => 'capsule'],
            ['name' => 'Enalapril',    'brand' => 'Renitec',           'active_ingredient' => 'Enalapril',    'format' => 'tablet'],
            ['name' => 'Lorazepam',    'brand' => 'Orfidal',           'active_ingredient' => 'Lorazepam',    'format' => 'tablet'],
            ['name' => 'Furosemida',   'brand' => 'Seguril',           'active_ingredient' => 'Furosemida',   'format' => 'tablet'],
            ['name' => 'Metformina',   'brand' => 'Dianben',           'active_ingredient' => 'Metformina',   'format' => 'tablet'],
            ['name' => 'Amoxicilina',  'brand' => 'Amoxicilina Kern',  'active_ingredient' => 'Amoxicilina',  'format' => 'capsule'],
        ])->map(fn ($med) => Medication::create(array_merge($med, [
            'description'  => null,
            'residence_id' => $residence->id,
        ])));

        $scheduleOptions = [
            ['08:00', '20:00'],
            ['08:00', '14:00', '20:00'],
            ['08:00'],
            ['08:00', '12:00', '20:00', '22:00'],
        ];

        $residents->each(function (Resident $resident) use ($medications, $medico, $scheduleOptions) {
            $meds = $medications->random(rand(1, 3));
            foreach ($meds as $med) {
                Prescription::create([
                    'resident_id'   => $resident->id,
                    'medication_id' => $med->id,
                    'user_id'       => $medico->id,
                    'dose'          => fake()->randomElement(['1 comprimido', '1 cápsula', '5 ml']),
                    'route'         => 'oral',
                    'schedules'     => fake()->randomElement($scheduleOptions),
                    'start_date'    => now()->subDays(rand(1, 20))->format('Y-m-d'),
                    'end_date'      => null,
                    'notes'         => null,
                    'active'        => true,
                ]);
            }
        });
    }
}

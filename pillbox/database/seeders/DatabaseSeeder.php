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

        $residentData = [
            ['first_name' => 'María',    'last_name' => 'García López',    'birth_date' => '1935-03-12', 'room' => '101', 'doctor' => 'Dr. Fernández'],
            ['first_name' => 'Antonio',  'last_name' => 'Martínez Ruiz',   'birth_date' => '1938-07-22', 'room' => '102', 'doctor' => 'Dr. Fernández'],
            ['first_name' => 'Carmen',   'last_name' => 'Sánchez Pérez',   'birth_date' => '1932-11-05', 'room' => '103', 'doctor' => 'Dr. Fernández'],
            ['first_name' => 'José',     'last_name' => 'Rodríguez Díaz',  'birth_date' => '1940-01-18', 'room' => '104', 'doctor' => 'Dr. Fernández'],
            ['first_name' => 'Dolores',  'last_name' => 'González Muñoz',  'birth_date' => '1936-09-30', 'room' => '105', 'doctor' => 'Dr. Fernández'],
            ['first_name' => 'Manuel',   'last_name' => 'López Jiménez',   'birth_date' => '1933-05-14', 'room' => '106', 'doctor' => 'Dr. Fernández'],
            ['first_name' => 'Francisca','last_name' => 'Pérez Moreno',    'birth_date' => '1939-12-08', 'room' => '107', 'doctor' => 'Dr. Fernández'],
            ['first_name' => 'Francisco','last_name' => 'Hernández Torres', 'birth_date' => '1937-04-25', 'room' => '108', 'doctor' => 'Dr. Fernández'],
        ];

        $residents = collect($residentData)->map(fn ($data) => Resident::create(array_merge($data, [
            'status'       => 'active',
            'residence_id' => $residence->id,
        ])));

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
                    'dose'          => ['1 comprimido', '1 cápsula', '5 ml'][array_rand(['1 comprimido', '1 cápsula', '5 ml'])],
                    'route'         => 'oral',
                    'schedules'     => $scheduleOptions[array_rand($scheduleOptions)],
                    'start_date'    => now()->subDays(rand(1, 20))->format('Y-m-d'),
                    'end_date'      => null,
                    'notes'         => null,
                    'active'        => true,
                ]);
            }
        });
    }
}

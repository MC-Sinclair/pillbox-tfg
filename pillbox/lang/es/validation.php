<?php

return [
    'required' => 'El campo :attribute es obligatorio.',
    'string'   => 'El campo :attribute debe ser texto.',
    'max'      => [
        'string' => 'El campo :attribute no puede superar :max caracteres.',
    ],
    'min' => [
        'string' => 'El campo :attribute debe tener al menos :min caracteres.',
    ],
    'email'   => 'El campo :attribute debe ser un correo válido.',
    'unique'  => 'Este :attribute ya está en uso.',
    'date'    => 'El campo :attribute no es una fecha válida.',
    'boolean' => 'El campo :attribute debe ser verdadero o falso.',
    'in'      => 'El valor seleccionado en :attribute no es válido.',
    'exists'  => 'El valor seleccionado en :attribute no es válido.',
    'array'   => 'El campo :attribute debe ser una lista.',
    'nullable'=> '',

    'attributes' => [
        'name'              => 'nombre',
        'email'             => 'correo',
        'password'          => 'contraseña',
        'role'              => 'rol',
        'active'            => 'estado',
        'first_name'        => 'nombre',
        'last_name'         => 'apellidos',
        'birth_date'        => 'fecha de nacimiento',
        'room'              => 'habitación',
        'doctor'            => 'médico responsable',
        'status'            => 'estado',
        'gerocultora_ids'   => 'gerocultoras',
        'resident_ids'      => 'pacientes',
        'name'              => 'nombre',
        'brand'             => 'marca',
        'active_ingredient' => 'principio activo',
        'format'            => 'formato',
        'description'       => 'descripción',
    ],
];
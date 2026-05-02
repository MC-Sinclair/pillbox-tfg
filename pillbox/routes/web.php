<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Medico;
use App\Http\Controllers\PanelController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Landing')->name('landing');

Route::middleware(['auth', 'role:gerocultora'])->group(function () {
    Route::get('/panel', [PanelController::class, 'index'])->name('panel.index');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/usuarios',     [Admin\UserController::class,      'index'])->name('usuarios.index');
    Route::get('/residentes',   [Admin\ResidentController::class,  'index'])->name('residentes.index');
    Route::get('/medicamentos', [Admin\MedicationController::class,'index'])->name('medicamentos.index');
});

Route::middleware(['auth', 'role:medico'])->prefix('medico')->name('medico.')->group(function () {
    Route::get('/pautas',       [Medico\PrescriptionController::class, 'index'])->name('pautas.index');
    Route::get('/historial',    [Medico\HistorialController::class,    'index'])->name('historial.index');
    Route::get('/medicamentos', [Medico\MedicationController::class,   'index'])->name('medicamentos.index');
});

require __DIR__.'/settings.php';

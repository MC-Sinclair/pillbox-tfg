<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Medico;
use App\Http\Controllers\PanelController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Landing')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'role:gerocultora'])->group(function () {
    Route::get('/panel', [PanelController::class, 'index'])->name('panel.index');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/usuarios',                        [Admin\UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios',                       [Admin\UserController::class, 'store'])->name('usuarios.store');
    Route::put('/usuarios/{user}',                 [Admin\UserController::class, 'update'])->name('usuarios.update');
    Route::delete('/usuarios/{user}',              [Admin\UserController::class, 'destroy'])->name('usuarios.destroy');
    Route::post('/usuarios/{user}/residentes',     [Admin\UserController::class, 'assignResidents'])->name('usuarios.residentes');

    Route::get('/residentes',                          [Admin\ResidentController::class, 'index'])->name('residentes.index');
    Route::post('/residentes',                         [Admin\ResidentController::class, 'store'])->name('residentes.store');
    Route::put('/residentes/{resident}',               [Admin\ResidentController::class, 'update'])->name('residentes.update');
    Route::delete('/residentes/{resident}',            [Admin\ResidentController::class, 'destroy'])->name('residentes.destroy');
    Route::post('/residentes/{resident}/gerocultoras', [Admin\ResidentController::class, 'assignGerocultoras'])->name('residentes.gerocultoras');

    Route::get('/medicamentos',              [Admin\MedicationController::class, 'index'])->name('medicamentos.index');
    Route::post('/medicamentos',             [Admin\MedicationController::class, 'store'])->name('medicamentos.store');
    Route::put('/medicamentos/{medication}', [Admin\MedicationController::class, 'update'])->name('medicamentos.update');
    Route::delete('/medicamentos/{medication}', [Admin\MedicationController::class, 'destroy'])->name('medicamentos.destroy');
});

Route::middleware(['auth', 'role:medico'])->prefix('medico')->name('medico.')->group(function () {
    Route::get('/pautas',                        [Medico\PrescriptionController::class, 'index'])->name('pautas.index');
    Route::post('/pautas',                       [Medico\PrescriptionController::class, 'store'])->name('pautas.store');
    Route::put('/pautas/{prescription}',         [Medico\PrescriptionController::class, 'update'])->name('pautas.update');
    Route::delete('/pautas/{prescription}',      [Medico\PrescriptionController::class, 'destroy'])->name('pautas.destroy');

    Route::get('/historial',    [Medico\HistorialController::class,  'index'])->name('historial.index');
    Route::get('/medicamentos', [Medico\MedicationController::class, 'index'])->name('medicamentos.index');
});

require __DIR__.'/settings.php';

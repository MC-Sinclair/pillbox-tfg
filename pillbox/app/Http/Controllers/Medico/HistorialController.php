<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HistorialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Medico/Historial');
    }
}

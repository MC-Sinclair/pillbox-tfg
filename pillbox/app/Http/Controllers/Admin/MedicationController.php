<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class MedicationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Index', ['tab' => 'medicamentos']);
    }
}

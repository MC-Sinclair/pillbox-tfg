<?php

namespace App\Console\Commands;

use App\Models\Administration;
use App\Models\Prescription;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateDailyAdministrations extends Command
{
    protected $signature   = 'administrations:generate';
    protected $description = 'Crea los slots de administración del día y marca como missed los vencidos';

    public function handle(): int
    {
        $today = now()->toDateString();

        $prescriptions = Prescription::where('active', true)
            ->where('start_date', '<=', $today)
            ->where(fn ($q) => $q->whereNull('end_date')->orWhere('end_date', '>=', $today))
            ->get(['id', 'schedules']);

        foreach ($prescriptions as $prescription) {
            foreach ($prescription->schedules as $time) {
                $scheduledAt = Carbon::parse($today.' '.$time.':00');

                $admin = Administration::firstOrCreate(
                    ['prescription_id' => $prescription->id, 'scheduled_at' => $scheduledAt],
                    ['status' => 'pending']
                );

                if ($admin->status === 'pending' && $scheduledAt->lt(now()->subMinutes(30))) {
                    $admin->update(['status' => 'missed']);
                }
            }
        }

        $this->info('Slots generados y vencidos marcados correctamente.');

        return self::SUCCESS;
    }
}
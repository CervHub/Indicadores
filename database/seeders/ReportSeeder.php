<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Module;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Indicar que el proceso ha comenzado
        $this->command->info("Iniciando el proceso de ReportSeeder...");

        // Get only id and levels fields from reports (modules)
        $reports = Module::select('id', 'levels')->get();

        $this->command->info("Total reports found: " . $reports->count());

        $processedCount = 0;
        $updatedCount = 0;

        foreach ($reports as $report) {
            $processedCount++;
            $this->command->info("Processing report ID: {$report->id}");

            try {
                // Skip if levels is null or empty
                if (empty($report->levels)) {
                    $this->command->info("Report ID {$report->id}: levels field is empty");
                    continue;
                }

                $this->command->info("Report ID {$report->id}: levels = {$report->levels}");

                // Decode the levels JSON field
                $levels = json_decode($report->levels, true);

                // Skip if decode failed or not an array
                if (!$levels || !is_array($levels)) {
                    $this->command->info("Report ID {$report->id}: failed to decode levels JSON");
                    continue;
                }

                $this->command->info("Report ID {$report->id}: decoded levels = " . json_encode($levels));

                // Extract gerencia value as entity_id
                if (isset($levels['gerencia']) && $levels['gerencia'] !== null) {
                    try {
                        // Update the report with the gerencia value as entity_id
                        $report->update(['entity_id' => $levels['gerencia']]);
                        $updatedCount++;

                        $this->command->info("Updated report ID {$report->id} with entity_id: {$levels['gerencia']} from gerencia");
                    } catch (\Exception $e) {
                        // Log error but continue
                        $this->command->error("Error updating report ID {$report->id}: " . $e->getMessage());
                        continue;
                    }
                } else {
                    $this->command->info("Report ID {$report->id}: gerencia field is null or missing");
                }
            } catch (\Exception $e) {
                // Log error but continue with next report
                $this->command->error("Error processing report ID {$report->id}: " . $e->getMessage());
                continue;
            }
        }

        $this->command->info("Processed {$processedCount} reports, updated {$updatedCount} reports");
    }
}

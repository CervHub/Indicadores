<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeServiceCommand extends Command
{
    protected $signature = 'make:service {name}';
    protected $description = 'Create a new service class';

    public function handle()
    {
        $name = $this->argument('name');
        $path = app_path("Services/{$name}.php");

        // Check if the file already exists
        if (File::exists($path)) {
            $this->error("The service {$name} already exists.");
            return Command::FAILURE;
        }

        // Create the directory if it does not exist
        File::ensureDirectoryExists(dirname($path));

        // Create the service content
        $stub = "<?php\n\nnamespace App\Services;\n\nclass {$name}\n{\n    // Your service logic here\n}\n";

        // Save the file
        File::put($path, $stub);

        $this->info("The service {$name} has been created successfully.");
        return Command::SUCCESS;
    }
}

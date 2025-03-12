<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeRepositoryCommand extends Command
{
    protected $signature = 'make:repository {name}';
    protected $description = 'Create a new repository class';

    public function handle()
    {
        $name = $this->argument('name');
        $path = app_path("Repositories/{$name}.php");

        // Check if the file already exists
        if (File::exists($path)) {
            $this->error("The repository {$name} already exists.");
            return Command::FAILURE;
        }

        // Create the directory if it does not exist
        File::ensureDirectoryExists(dirname($path));

        // Create the repository content
        $stub = "<?php\n\nnamespace App\Repositories;\n\nclass {$name}\n{\n    // Your repository logic here\n}\n";

        // Save the file
        File::put($path, $stub);

        $this->info("The repository {$name} has been created successfully.");
        return Command::SUCCESS;
    }
}

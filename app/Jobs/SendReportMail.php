<?php

namespace App\Jobs;

use App\Mail\TestEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendReportMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $report;
    protected $date;
    protected $management;
    protected $generatedBy;
    protected $reportLink;

    /**
     * Create a new job instance.
     */
    public function __construct($email, $report, $date, $management, $generatedBy, $reportLink)
    {
        $this->email = $email;
        $this->report = $report;
        $this->date = $date;
        $this->management = $management;
        $this->generatedBy = $generatedBy;
        $this->reportLink = $reportLink;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->email)->send(new TestEmail($this->report, $this->date, $this->management, $this->generatedBy, $this->reportLink));
            Log::info('Email sent successfully to ' . $this->email);
        } catch (\Exception $e) {
            Log::error('Failed to send email to ' . $this->email . '. Error: ' . $e->getMessage());
        }
    }
}
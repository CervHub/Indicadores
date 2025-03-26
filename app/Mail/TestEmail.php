<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TestEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $report;
    public $date;
    public $management;
    public $generatedBy;
    public $reportLink;

    /**
     * Create a new message instance.
     */
    public function __construct($report, $date, $management, $generatedBy, $reportLink)
    {
        $this->report = $report;
        $this->date = $date;
        $this->management = $management;
        $this->generatedBy = $generatedBy;
        $this->reportLink = $reportLink;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $logoPath = url('logos/logo-souther-300x-white.png');

        return $this->subject("Reporte de : \"{$this->report}\"")
            ->view('emails.test_email')
            ->with([
                'report' => $this->report,
                'date' => $this->date,
                'management' => $this->management,
                'generatedBy' => $this->generatedBy,
                'reportLink' => $this->reportLink,
                'logoUrl' => $logoPath,
            ]);
    }
}

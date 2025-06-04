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
    public $empresaReportada;
    public $empresaQueReporta;
    public $emailView;
    public $status;

    /**
     * Create a new message instance.
     */
    public function __construct($report, $date, $generatedBy, $reportLink, $empresaReportada, $empresaQueReporta, $emailView = 'emails.test_email', $status = 'ABIERTO')
    {
        $this->report = $report;
        $this->date = $date;
        $this->generatedBy = $generatedBy;
        $this->reportLink = $reportLink;
        $this->empresaReportada = $empresaReportada;
        $this->empresaQueReporta = $empresaQueReporta;
        $this->emailView = $emailView;
        $this->status = $status;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $logoPath = url('logos/logo-souther-300x-white.png');

        return $this->subject("Reporte de : \"{$this->report}\" [{$this->status}]")
            ->view($this->emailView)
            ->with([
                'report' => $this->report,
                'date' => $this->date,
                'generatedBy' => $this->generatedBy,
                'reportLink' => $this->reportLink,
                'empresaReportada' => $this->empresaReportada,
                'empresaQueReporta' => $this->empresaQueReporta,
                'logoUrl' => $logoPath,
                'status' => $this->status,
            ]);
    }
}

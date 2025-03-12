<?php

namespace App\Services;

use App\Imports\AnnexImport;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Uea;
use App\Models\ContractorCompanyType;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Services\UtilService;
use App\Models\Annex24;
use App\Models\Annex25;
use App\Models\Annex26;
use App\Models\Annex27;
use App\Models\Annex28;
use App\Models\Annex30;
use App\Models\MinemTemplate1;
use App\Models\MinemTemplate2;
use Illuminate\Support\Facades\Auth;

class AttachmentAnalyzerService
{
    protected $utilService;
    protected $contractorCompanyTypeId;
    protected $ueaId;
    protected $year;
    protected $month;
    protected $userId;
    protected $filePath;

    public function __construct(UtilService $utilService)
    {
        $this->utilService = $utilService;
        $this->contractorCompanyTypeId = null;
        $this->ueaId = null;
        $this->year = null;
        $this->month = null;
        $this->userId = Auth::user()->id;
        $this->filePath = null;
    }

    public function saveAnexo(array $request)
    {
        try {
            if (!isset($request['file'])) {
                throw new Exception('File not provided in the request.');
            }

            $file = $request['file'];

            if (!isset($request['contractor_company_type_id']) || !isset($request['uea_id'])) {
                throw new Exception('Required parameters missing: contractor_company_type_id or uea_id.');
            }

            $this->contractorCompanyTypeId = $request['contractor_company_type_id'];
            $this->ueaId = $request['uea_id'];
            $this->year = $request['year'] ?? null;
            $this->month = $request['month'] ?? null;

            $typeClient = ContractorCompanyType::find($request['contractor_company_type_id']);
            if (!$typeClient) {
                throw new Exception('ContractorCompanyType not found.');
            }

            $uea = Uea::find($request['uea_id']);
            if (!$uea) {
                throw new Exception('Uea not found.');
            }

            $folder = 'indicadores/';
            $filePath = $this->utilService->saveFile($file, $folder);
            $this->filePath = $filePath;

            $import = new AnnexImport($file->getRealPath(), $typeClient->abbreviation, $uea->name);
            Excel::import($import, $file);

            $data = $import->getData();
            $this->processData($data);

            dd('Imported successfully', $data);
        } catch (Exception $e) {
            Log::error('Error importing file: ' . $filePath . ' - ' . $e->getMessage());
            dd('Failed to import file: ' . $e->getMessage());
        }
    }

    protected function processData(array $data)
    {
        foreach ($data as $key => $value) {
            switch ($key) {
                case 'ANEXO 24':
                case 'ANEXO 25':
                case 'ANEXO 26':
                case 'ANEXO 27':
                    $this->processAnexo24To27($value, $key);
                    break;
                case 'ANEXO 28':
                    $this->processAnexo28($value);
                    break;
                case 'ANEXO 30':
                    $this->processAnexo30($value);
                    break;
                case 'PLANTILLA MINEM 1':
                case 'PLANTILLA MINEM 2':
                    $this->processMinemTemplates($value);
                    break;
                default:
                    Log::warning('Unknown data type: ' . $key);
                    break;
            }
        }
    }

    protected function processAnexo24To27(array $data, string $key)
    {
        $model = match ($key) {
            'ANEXO 24' => new Annex24(),
            'ANEXO 25' => new Annex25(),
            'ANEXO 26' => new Annex26(),
            'ANEXO 27' => new Annex27(),
            default => null,
        };

        if ($model) {
            foreach ($data as $item) {
                $model->create([
                    'contractor_company_id' => 1,
                    'contractor_company_type_id' => $this->contractorCompanyTypeId,
                    'uea_id' => $this->ueaId,
                    'user_id' => 1,
                    'file' => $this->filePath,
                    'year' => $this->year,
                    'month' => $this->month,
                    'empl' => $item[1] ?? 0,
                    'obr' => $item[2] ?? 0,
                    'day1' => $item[4] ?? 0,
                    'day2' => $item[5] ?? 0,
                    'day3' => $item[6] ?? 0,
                    'day4' => $item[7] ?? 0,
                    'day5' => $item[8] ?? 0,
                    'day6' => $item[9] ?? 0,
                    'day7' => $item[10] ?? 0,
                    'day8' => $item[11] ?? 0,
                    'day9' => $item[12] ?? 0,
                    'day10' => $item[13] ?? 0,
                    'day11' => $item[14] ?? 0,
                    'day12' => $item[15] ?? 0,
                    'day13' => $item[16] ?? 0,
                    'day14' => $item[17] ?? 0,
                    'day15' => $item[18] ?? 0,
                    'day16' => $item[19] ?? 0,
                    'day17' => $item[20] ?? 0,
                    'day18' => $item[21] ?? 0,
                    'day19' => $item[22] ?? 0,
                    'day20' => $item[23] ?? 0,
                    'day21' => $item[24] ?? 0,
                    'day22' => $item[25] ?? 0,
                    'is_old' => false
                ]);
            }
        } else {
            Log::warning('No model found for key: ' . $key);
        }
    }

    protected function processAnexo28(array $data)
    {
        // Process data for ANEXO 28
    }

    protected function processAnexo30(array $data)
    {
        // Process data for ANEXO 30
    }

    protected function processMinemTemplates(array $data)
    {
        // Process data for PLANTILLA MINEM 1 and PLANTILLA MINEM 2
    }
}

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
use App\Models\FileStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AttachmentAnalyzerService
{
    protected $utilService;
    protected $contractorCompanyTypeId;
    protected $ueaId;
    protected $year;
    protected $month;
    protected $filePath;
    protected $fileStatus;
    protected $userId;
    protected $contractorCompanyId;
    protected $dataImport;

    public function __construct(UtilService $utilService)
    {
        $this->utilService = $utilService;
        $this->contractorCompanyTypeId = null;
        $this->ueaId = null;
        $this->year = null;
        $this->month = null;
        $this->filePath = null;
        $this->fileStatus = null;
        $this->contractorCompanyId = null;
        $this->userId = null;
        $this->dataImport = [];
    }

    public function saveAnexo(array $request)
    {
        DB::beginTransaction();

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
            $this->contractorCompanyId = $request['contractor_company_id'];
            $this->userId = $request['user_id'];

            $typeClient = ContractorCompanyType::find($request['contractor_company_type_id']);
            if (!$typeClient) {
                throw new Exception('ContractorCompanyType not found.');
            }

            $uea = Uea::find($request['uea_id']);
            if (!$uea) {
                throw new Exception('Uea not found.');
            }

            $folder = 'indicadores';

            $import = new AnnexImport($file->getRealPath(), $typeClient->abbreviation, $uea->name);
            Excel::import($import, $file);

            $data = $import->getData();

            // Validar datos generando errores si están vacíos
            $requiredData = [
                'ANEXO 24' => 'ANEXO 24',
                'ANEXO 25' => 'ANEXO 25',
                'ANEXO 26' => 'ANEXO 26',
                'ANEXO 27' => 'ANEXO 27',
                'ANEXO 28' => 'ANEXO 28',
                'PLANTILLA MINEM 1' => 'PLANTILLA MINEM 1',
                'PLANTILLA MINEM 2' => 'PLANTILLA MINEM 2'
            ];

            foreach ($requiredData as $key => $value) {
                if (empty($data[$key])) {
                    switch ($key) {
                        case 'ANEXO 24':
                        case 'ANEXO 25':
                        case 'ANEXO 26':
                        case 'ANEXO 27':
                            throw new Exception("El Anexo $value debe contener al menos llenado el Nombre de la empresa, Empl. Obr. y TOTAL.");
                            break;
                        case 'ANEXO 28':
                            throw new Exception("El Anexo $value debe contener al menos llenado Nombre del Titular de Actividades, SITUACION, Nro RUC, EMPL., OBR. y TOTAL.");
                            break;
                        case 'PLANTILLA MINEM 1':
                            throw new Exception("La $value debe contener al menos llenado el RUC, Nombre Concesion, UEA, Tipo Cliente, Nombre Empresa, Total trabajadores, Total horas trabajadas y Actividades Mineras.");
                            break;
                        case 'PLANTILLA MINEM 2':
                            throw new Exception("La $value debe contener al menos llenado el RUC, Nombre Concesion, UEA, Tipo Cliente, Nombre Empresa.");
                            break;
                    }
                }
            }


            //Creamos un file status y guardamos el archivo
            $filePath = $this->utilService->saveFile($file, $folder);
            $this->filePath = $filePath;

            //Todos los anteiores fileStatus los pasamos a is_old = true
            FileStatus::where('uea_id', $this->ueaId)
                ->where('contractor_company_id', $this->contractorCompanyId)
                ->where('contractor_company_type_id', $this->contractorCompanyTypeId)
                ->where('is_old', false)
                ->where('year', $this->year)
                ->where('month', $this->month)
                ->update(['is_old' => true]);

            $this->fileStatus = FileStatus::create([
                'file' => $filePath,
                'contractor_company_id' => $this->contractorCompanyId,
                'contractor_company_type_id' => $this->contractorCompanyTypeId,
                'uea_id' => $this->ueaId,
                'user_id' => $this->userId,
                'year' => $this->year,
                'month' => $this->month,
                'annex24' => isset($data['ANEXO 24']) && !empty($data['ANEXO 24']),
                'annex25' => isset($data['ANEXO 25']) && !empty($data['ANEXO 25']),
                'annex26' => isset($data['ANEXO 26']) && !empty($data['ANEXO 26']),
                'annex27' => isset($data['ANEXO 27']) && !empty($data['ANEXO 27']),
                'annex28' => isset($data['ANEXO 28']) && !empty($data['ANEXO 28']),
                'annex30' => isset($data['ANEXO 30']) && !empty($data['ANEXO 30']),
                'minem_template_1' => isset($data['PLANTILLA MINEM 1']) && !empty($data['PLANTILLA MINEM 1']),
                'minem_template_2' => isset($data['PLANTILLA MINEM 2']) && !empty($data['PLANTILLA MINEM 2']),
                'is_old' => false
            ]);

            if (!$this->fileStatus) {
                throw new Exception('FileStatus not created.');
            }

            $this->processData($data);

            DB::commit();

            //Eliminamos todos los detalles de los archivos anteriores
            $fileStatusIds = FileStatus::where('uea_id', $this->ueaId)
                ->where('contractor_company_id', $this->contractorCompanyId)
                ->where('contractor_company_type_id', $this->contractorCompanyTypeId)
                ->where('is_old', true)
                ->where('year', $this->year)
                ->where('month', $this->month)
                ->pluck('id');

            Annex24::whereIn('file_status_id', $fileStatusIds)->delete();
            Annex25::whereIn('file_status_id', $fileStatusIds)->delete();
            Annex26::whereIn('file_status_id', $fileStatusIds)->delete();
            Annex27::whereIn('file_status_id', $fileStatusIds)->delete();
            Annex28::whereIn('file_status_id', $fileStatusIds)->delete();
            Annex30::whereIn('file_status_id', $fileStatusIds)->delete();
            MinemTemplate1::whereIn('file_status_id', $fileStatusIds)->delete();
            MinemTemplate2::whereIn('file_status_id', $fileStatusIds)->delete();
        } catch (Exception $e) {
            DB::rollBack();
            // dd($e->getMessage());
            throw new \Exception($e->getMessage());
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
                    $this->processMinemTemplate1($value);
                    break;
                case 'PLANTILLA MINEM 2':
                    $this->processMinemTemplate2($value);
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
                    'file_status_id' => $this->fileStatus->id,
                    'contractor_company_id' => $this->contractorCompanyId,
                    'contractor_company_type_id' => $this->contractorCompanyTypeId,
                    'uea_id' => $this->ueaId,
                    'user_id' => 1,
                    'file' => $this->filePath,
                    'year' => $this->year,
                    'month' => $this->month,
                    'empl' => (int) ($item[1] ?? 0),
                    'obr' => (int) ($item[2] ?? 0),
                    'day1' => (int) ($item[4] ?? 0),
                    'day2' => (int) ($item[5] ?? 0),
                    'day3' => (int) ($item[6] ?? 0),
                    'day4' => (int) ($item[7] ?? 0),
                    'day5' => (int) ($item[8] ?? 0),
                    'day6' => (int) ($item[9] ?? 0),
                    'day7' => (int) ($item[10] ?? 0),
                    'day8' => (int) ($item[11] ?? 0),
                    'day9' => (int) ($item[12] ?? 0),
                    'day10' => (int) ($item[13] ?? 0),
                    'day11' => (int) ($item[14] ?? 0),
                    'day12' => (int) ($item[15] ?? 0),
                    'day13' => (int) ($item[16] ?? 0),
                    'day14' => (int) ($item[17] ?? 0),
                    'day15' => (int) ($item[18] ?? 0),
                    'day16' => (int) ($item[19] ?? 0),
                    'day17' => (int) ($item[20] ?? 0),
                    'day18' => (int) ($item[21] ?? 0),
                    'day19' => (int) ($item[22] ?? 0),
                    'day20' => (int) ($item[23] ?? 0),
                    'day21' => (int) ($item[24] ?? 0),
                    'day22' => (int) ($item[25] ?? 0),
                    'is_old' => false
                ]);
            }
        } else {
            Log::warning('No model found for key: ' . $key);
        }
    }

    protected function processAnexo28(array $data)
    {
        $annex28 = new Annex28();
        foreach ($data as $item) {

            $annex28->create([
                'file_status_id' => $this->fileStatus->id,
                'contractor_company_id' => $this->contractorCompanyId,
                'contractor_company_type_id' => $this->contractorCompanyTypeId,
                'uea_id' => $this->ueaId,
                'user_id' => 1,
                'file' => $this->filePath,
                'year' => $this->year,
                'month' => $this->month,
                'situation' => $item[1] ?? '',
                'employees' => $item[3] ?? 0,
                'workers' => $item[4] ?? 0,
                'incidents' => $item[6] ?? 0,
                'dangerous_incidents' => $item[8] ?? 0,
                'minor_accidents' => $item[10] ?? 0,
                'disability' => $item[12] ?? 0,
                'mortality' => $item[13] ?? 0,
                'lost_days' => $this->convertToDecimal($item[18] ?? 0),
                'man_hours_worked' => $this->convertToDecimal($item[20] ?? 0),
                'frequency_index' => $this->convertToDecimal($item[22] ?? 0),
                'severity_index' => $this->convertToDecimal($item[24] ?? 0),
                'accident_rate' => $this->convertToDecimal($item[26] ?? 0),
                'is_old' => false
            ]);
        }
    }

    protected function processAnexo30(array $data)
    {
        // Process data for ANEXO 30
        $annex30 = new Annex30();
        foreach ($data as $item) {
            $annex30->create([
                'file_status_id' => $this->fileStatus->id,
                'contractor_company_id' => $this->contractorCompanyId,
                'contractor_company_type_id' => $this->contractorCompanyTypeId,
                'uea_id' => $this->ueaId,
                'user_id' => 1,
                'file' => $this->filePath,
                'year' => $this->year,
                'month' => $this->month,
                'accident_type' => $item[1] ?? '',
                'injury_nature' => $item[2] ?? '',
                'age' => $item[3] ?? 0,
                'marital_status' => $item[4] ?? '',
                'education_level' => $item[5] ?? '',
                'years_experience' => $item[6] ?? 0,
                'time' => $item[7] ?? '',
                'day' => $item[8] ?? '',
                'month_name' => $item[9] ?? '',
                'partial_temporary' => $item[10] ?? 0,
                'permanent_temporary' => $item[11] ?? 0,
                'partial_permanent' => $item[12] ?? 0,
                'total_permanent' => $item[13] ?? 0,
                'disability' => $item[14] ?? 0,
                'occupation' => $item[15] ?? '',
                'remuneration' => $this->convertToDecimal($item[16] ?? 0),
                'is_old' => false
            ]);
        }
    }

    protected function processMinemTemplate1(array $data)
    {
        foreach ($data as $item) {
            $minemTemplate1 = new MinemTemplate1();
            $minemTemplate1->create([
                'file_status_id' => $this->fileStatus->id,
                'contractor_company_id' => $this->contractorCompanyId,
                'contractor_company_type_id' => $this->contractorCompanyTypeId,
                'uea_id' => $this->ueaId,
                'user_id' => 1,
                'file' => $this->filePath,
                'year' => $this->year,
                'month' => $this->month,
                'concession_code' => $item[1] ?? '',
                'concession_name' => $item[2] ?? '',
                'local_male_workers' => (int) ($item[5] ?? 0),
                'regional_male_workers' => (int) ($item[6] ?? 0),
                'national_male_workers' => (int) ($item[7] ?? 0),
                'foreign_male_workers' => (int) ($item[8] ?? 0),
                'local_female_workers' => (int) ($item[9] ?? 0),
                'regional_female_workers' => (int) ($item[10] ?? 0),
                'national_female_workers' => (int) ($item[11] ?? 0),
                'foreign_female_workers' => (int) ($item[12] ?? 0),
                'local_male_employees' => (int) ($item[13] ?? 0),
                'regional_male_employees' => (int) ($item[14] ?? 0),
                'national_male_employees' => (int) ($item[15] ?? 0),
                'foreign_male_employees' => (int) ($item[16] ?? 0),
                'local_female_employees' => (int) ($item[17] ?? 0),
                'regional_female_employees' => (int) ($item[18] ?? 0),
                'national_female_employees' => (int) ($item[19] ?? 0),
                'foreign_female_employees' => (int) ($item[20] ?? 0),
                'total_employees' => (int) ($item[21] ?? 0),
                'total_hours_employees' => $this->convertToDecimal($item[22] ?? 0), // Si es decimal, mantenerlo como está
                'mining_activities' => (int) ($item[23] ?? ''),
                'is_old' => false
            ]);
        }
    }

    protected function processMinemTemplate2(array $data)
    {
        foreach ($data as $item) {
            $minemTemplate2 = new MinemTemplate2();
            $minemTemplate2->create([
                'file_status_id' => $this->fileStatus->id,
                'contractor_company_id' => $this->contractorCompanyId,
                'contractor_company_type_id' => $this->contractorCompanyTypeId,
                'uea_id' => $this->ueaId,
                'user_id' => 1,
                'file' => $this->filePath,
                'year' => $this->year,
                'month' => $this->month,
                'concession_code' => $item[1] ?? '',
                'concession_name' => $item[2] ?? '',
                'male_managers' => $item[5] ?? 0,
                'male_administrative' => $item[6] ?? 0,
                'male_plant_staff' => $item[7] ?? 0,
                'male_general_operations' => $item[8] ?? 0,
                'female_managers' => $item[9] ?? 0,
                'female_administrative' => $item[10] ?? 0,
                'female_plant_staff' => $item[11] ?? 0,
                'female_general_operations' => $item[12] ?? 0,
                'is_old' => false
            ]);
        }
    }

    private function convertToDecimal($value)
    {
        return (float) str_replace(',', '', $value);
    }
}

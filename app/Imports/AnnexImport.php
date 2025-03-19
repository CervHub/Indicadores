<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\IOFactory;

class AnnexImport implements WithMultipleSheets
{
    private $filePath;
    private $typeClient;
    private $uea;
    private $data;
    private $keywordPositions;

    public function __construct($filePath, $typeClient, $uea)
    {
        $this->filePath = $filePath;
        $this->typeClient = $typeClient;
        $this->uea = $uea;
        $this->data = [];
        $this->keywordPositions = [];
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        try {
            $spreadsheet = IOFactory::load($this->filePath);
            $sheetNames = $spreadsheet->getSheetNames();
            $data = $this->initializeDataArray();

            // Validar todas las hojas antes de procesarlas
            $this->validateAllSheets($spreadsheet);
            foreach ($sheetNames as $sheetName) {
                $sheet = $spreadsheet->getSheetByName($sheetName);
                $sheetData = $sheet->toArray();

                switch ($sheetName) {
                    case 'ANEXO 24':
                        $data[$sheetName] = $this->processAnexo24($sheetData);
                        break;
                    case 'ANEXO 25':
                        $data[$sheetName] = $this->processAnexo25($sheetData);
                        break;
                    case 'ANEXO 26':
                        $data[$sheetName] = $this->processAnexo26($sheetData);
                        break;
                    case 'ANEXO 27':
                        $data[$sheetName] = $this->processAnexo27($sheetData);
                        break;
                    case 'ANEXO 28':
                        $data[$sheetName] = $this->processAnexo28($sheetData);
                        break;
                    case 'ANEXO 30':
                        $data[$sheetName] = $this->processAnexo30($sheetData);
                        break;
                    case 'PLANTILLA MINEM 1':
                        $data[$sheetName] = $this->processPlantillaMinem1($sheetData);
                        break;
                    case 'PLANTILLA MINEM 2':
                        $data[$sheetName] = $this->processPlantillaMinem2($sheetData);
                        break;
                }
            }
            $this->data = $data;
            // Retornar un array vacío ya que solo queremos listar las hojas
            return $data;
        } catch (\Exception $e) {
            // Handle the exception (e.g., log the error, rethrow the exception, return an error message, etc.)
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Initialize the data array with predefined sheet names.
     *
     * @return array
     */
    private function initializeDataArray(): array
    {
        return [
            'ANEXO 24' => [],
            'ANEXO 25' => [],
            'ANEXO 26' => [],
            'ANEXO 27' => [],
            'ANEXO 28' => [],
            'ANEXO 30' => [],
            'PLANTILLA MINEM 1' => [],
            'PLANTILLA MINEM 2' => []
        ];
    }

    /**
     * Get the processed data.
     *
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * Validate all sheets by checking for the presence of specific keywords.
     *
     * @param \PhpOffice\PhpSpreadsheet\Spreadsheet $spreadsheet
     * @throws \Exception
     */
    private function validateAllSheets($spreadsheet): void
    {
        $sheetNames = $spreadsheet->getSheetNames();
        $errors = [];

        foreach ($sheetNames as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            $sheetData = $sheet->toArray();

            $keywords = $this->getKeywordsForSheet($sheetName);
            foreach ($keywords as $keyword) {
                $found = false;
                foreach ($sheetData as $rowIndex => $row) {
                    if ($keyword === 'TOTAL') {
                        // Check only column A for 'TOTAL'
                        if (isset($row[0]) && $row[0] === 'TOTAL') {
                            $found = true;
                            $this->keywordPositions[$sheetName][$keyword] = $rowIndex;
                            break;
                        }
                    } else {
                        if (in_array($keyword, $row)) {
                            $found = true;
                            $this->keywordPositions[$sheetName][$keyword] = $rowIndex;
                            break;
                        }
                    }
                }
                if (!$found) {
                    $errors[] = $sheetName;
                    break;
                }
            }
        }

        if (!empty($errors)) {
            throw new \Exception(implode(", ", $errors));
        }
    }

    /**
     * Get the keywords for a specific sheet.
     *
     * @param string $sheetName
     * @return array
     */
    private function getKeywordsForSheet(string $sheetName): array
    {
        switch ($sheetName) {
            case 'ANEXO 24':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 25':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 26':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 27':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 28':
                return ['INCAP.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'TOTAL'];
            case 'ANEXO 30':
                return ['Día (F)', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS', 'Nota:'];
            case 'PLANTILLA MINEM 1':
                return ['RUC'];
            case 'PLANTILLA MINEM 2':
                return ['RUC'];
            default:
                return [];
        }
    }

    private function processAnexo(array $sheetData, string $anexo, int $columnCount): array
    {
        try {
            $limits = $this->keywordPositions[$anexo];

            switch ($this->typeClient) {
                case 'T':
                    $startRow = $limits['EMPL.'] + 1;
                    $endRow = $limits['EMPRESA CONTRATISTA MINERO'] - 1;
                    break;
                case 'E':
                    $startRow = $limits['EMPRESA CONTRATISTA MINERO'] + 1;
                    $endRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] - 1;
                    break;
                case 'O':
                    $startRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] + 1;
                    $endRow = $limits['TOTAL'] - 1;
                    break;
                default:
                    return [];
            }

            return $this->extractData($sheetData, $startRow, $endRow, $columnCount);
        } catch (\Exception $e) {
            // Handle the exception (e.g., log the error, rethrow the exception, return an error message, etc.)
            throw new \Exception("Error processing $anexo: " . $e->getMessage());
        }
    }

    private function processAnexo24(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 24', 24);
    }

    private function processAnexo25(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 25', 24);
    }

    private function processAnexo26(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 26', 24);
    }

    private function processAnexo27(array $sheetData): array
    {
        return $this->processAnexo($sheetData, 'ANEXO 27', 24);
    }

    private function processAnexo28(array $sheetData): array
    {
        $limits = $this->keywordPositions['ANEXO 28'];

        switch ($this->typeClient) {
            case 'T':
                $startRow = $limits['INCAP.'] + 1;
                $endRow = $limits['EMPRESA CONTRATISTA MINERO'] - 1;
                break;
            case 'E':
                $startRow = $limits['EMPRESA CONTRATISTA MINERO'] + 1;
                $endRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] - 1;
                break;
            case 'O':
                $startRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] + 1;
                $endRow = $limits['TOTAL'] - 1;
                break;
            default:
                return [];
        }
        return $this->extractData($sheetData, $startRow, $endRow, 28);
    }

    private function processAnexo30(array $sheetData): array
    {
        $limits = $this->keywordPositions['ANEXO 30'];

        switch ($this->typeClient) {
            case 'T':
                $startRow = $limits['Día (F)'] + 1;
                $endRow = $limits['EMPRESA CONTRATISTA MINERO'] - 1;
                break;
            case 'E':
                $startRow = $limits['EMPRESA CONTRATISTA MINERO'] + 1;
                $endRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] - 1;
                break;
            case 'O':
                $startRow = $limits['EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'] + 1;
                $endRow = $limits['Nota:'] - 1;
                break;
            default:
                return [];
        }
        return $this->extractData($sheetData, $startRow, $endRow, 17);
    }

    private function processPlantillaMinem1(array $sheetData): array
    {
        $limits = $this->keywordPositions['PLANTILLA MINEM 1'];
        $startRow = $limits['RUC'] + 1;
        $endRow = $endRow ?? count($sheetData) - 1;
        return $this->extractData($sheetData, $startRow, $endRow, 13, 4);
    }

    private function processPlantillaMinem2(array $sheetData): array
    {
        $limits = $this->keywordPositions['PLANTILLA MINEM 2'];
        $startRow = $limits['RUC'] + 1;
        $endRow = $endRow ?? count($sheetData) - 1;

        return $this->extractData($sheetData, $startRow, $endRow, 13, 4);
    }

    /**
     * Extract data from a specific range of rows and columns.
     *
     * @param array $data
     * @param int $startRow
     * @param int $endRow
     * @param int $columnCount
     * @return array
     */
    private function extractData(array $data, int $startRow, int $endRow, int $columnCount, int $filterColumnIndex = 0): array
    {
        $filteredData = array_slice($data, $startRow, $endRow - $startRow + 1);
        $filteredRows = [];
        foreach ($filteredData as $key => &$row) {
            if (strtoupper($row[0]) === 'TOTAL') {
                unset($filteredData[$key]);
                continue;
            }
            $row = array_slice($row, 0, $columnCount); // Columns A to specified column count
            if (!empty($row[$filterColumnIndex])) {
                $filteredRows[] = $row;
            }
        }
        return array_values($filteredRows); // Reindex array to avoid gaps
    }
}

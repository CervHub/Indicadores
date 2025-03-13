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

    public function __construct($filePath, $typeClient, $uea)
    {
        $this->filePath = $filePath;
        $this->typeClient = $typeClient;
        $this->uea = $uea;
        $this->data = [];
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
                    case 'ANEXO 25':
                    case 'ANEXO 26':
                    case 'ANEXO 27':
                        $data[$sheetName] = $this->processSheetForTypeClient($sheetData, 26, true, 0, 0);
                        break;
                    case 'ANEXO 28':
                        $data[$sheetName] = $this->processSheetForTypeClient($sheetData, 28, true, 1, 0);
                        break;
                    case 'ANEXO 29':
                        $data[$sheetName] = $this->processSheetForTypeClient($sheetData, 16, true, 0, 0, 'ANEXO 29');
                        break;
                    case 'ANEXO 30':
                        $data[$sheetName] = $this->processSheetForTypeClient($sheetData, 17, true, 0, 0, 'ANEXO 30');
                        break;
                    case 'PLANTILLA MINEM 1':
                        $data[$sheetName] = $this->processSheet($sheetData, 'Nombre Concesion o UEA', '', 24, true, 2);
                        break;
                    case 'PLANTILLA MINEM 2':
                        $data[$sheetName] = $this->processSheet($sheetData, 'RUC', '', 13, true, 0);
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
            'ANEXO 29' => [],
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
                foreach ($sheetData as $row) {
                    if (in_array($keyword, $row)) {
                        $found = true;
                        break;
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
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'];
            case 'ANEXO 25':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'];
            case 'ANEXO 26':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'];
            case 'ANEXO 27':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'];
            case 'ANEXO 28':
                return ['EMPL.', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'];
            case 'ANEXO 29':
                return ['SPCC', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDAD CONEXA'];
            case 'ANEXO 30':
                return ['Día (F)', 'EMPRESA CONTRATISTA MINERO', 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS'];
            case 'PLANTILLA MINEM 1':
                return ['RUC'];
            case 'PLANTILLA MINEM 2':
                return ['RUC'];
            default:
                return [];
        }
    }

    /**
     * Process a sheet and extract data based on markers and column count.
     *
     * @param array $sheetData
     * @param string $startMarker
     * @param string $endMarker
     * @param int $columnCount
     * @param bool $filterEmptyRows
     * @param int $filterColumnIndex
     * @param int $addStartMarker
     * @param int $addEndMarker
     * @return array
     */
    private function processSheet(array $sheetData, string $startMarker, string $endMarker, int $columnCount, bool $filterEmptyRows = false, int $filterColumnIndex = 0, $addStartMarker = 0, $addEndMarker = 0): array
    {
        list($startRow, $endRow) = $this->getStartEndRows($sheetData, $startMarker, $endMarker);

        if ($startRow !== null) {

            $startRow += 1;
            $endRow = $endRow ?? count($sheetData) - 1;

            // para el tipo de titular
            $startRow += $addStartMarker;
            $endRow -= $addEndMarker;

            $extractedData = $this->extractData($sheetData, $startRow, $endRow, $columnCount);
            if ($filterEmptyRows) {
                $extractedData = array_filter($extractedData, function ($row) use ($filterColumnIndex) {
                    return !empty($row[$filterColumnIndex]);
                });
            }
            return $extractedData;
        }
        return [];
    }

    /**
     * Process a sheet based on typeClient and extract data.
     *
     * @param array $sheetData
     * @param int $columnCount
     * @param bool $filterEmptyRows
     * @param int $start
     * @param int $end
     * @param string $anexo
     * @return array
     */
    private function processSheetForTypeClient(array $sheetData, int $columnCount, bool $filterEmptyRows = false, $start = 0, $end = 0, $anexo = ''): array
    {

        switch ($this->typeClient) {
            case 'T':
                $beginLim = 'EMPL.';
                $endLim = 'EMPRESA CONTRATISTA MINERO';

                if ($anexo == 'ANEXO 29') {
                    $beginLim = 'SPCC';
                    $endLim = 'EMPRESA CONTRATISTA MINERO';
                }
                if ($anexo == 'ANEXO 30') {
                    $beginLim = 'Día (F)';
                    $endLim = 'EMPRESA CONTRATISTA MINERO';
                }
                return $this->processSheet($sheetData, $beginLim, $endLim, $columnCount, $filterEmptyRows, 1, 0 + $start, 1 + $end);
            case 'E':
                $beginLim = 'EMPRESA CONTRATISTA MINERO';
                $endLim = 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS';

                if ($anexo == 'ANEXO 29') {
                    $beginLim = 'EMPRESA CONTRATISTA MINERO';
                    $endLim = 'EMPRESA CONTRATISTA DE ACTIVIDAD CONEXA';
                }

                return $this->processSheet($sheetData, $beginLim, $endLim, $columnCount, $filterEmptyRows, 1, 0, 1);
            case 'O':
                $beginLim = 'EMPRESA CONTRATISTA DE ACTIVIDADES CONEXAS';
                $endLim = 'TOTAL';
                if ($anexo == 'ANEXO 29') {
                    $beginLim = 'EMPRESA CONTRATISTA DE ACTIVIDAD CONEXA';
                    $endLim = '';
                }
                if ($anexo == 'ANEXO 30') {
                    $endLim = '';
                }
                return $this->processSheet($sheetData, $beginLim, $endLim, $columnCount, $filterEmptyRows, 1, 0, 1);
            default:
                return [];
        }
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
    private function extractData(array $data, int $startRow, int $endRow, int $columnCount): array
    {
        $filteredData = array_slice($data, $startRow, $endRow - $startRow + 1);
        foreach ($filteredData as &$row) {
            $row = array_slice($row, 0, $columnCount); // Columns A to specified column count
        }
        return $filteredData;
    }

    /**
     * Get start and end row indices based on markers.
     *
     * @param array $data
     * @param string $startMarker
     * @param string $endMarker
     * @return array
     */
    private function getStartEndRows(array $data, string $startMarker, string $endMarker): array
    {
        $startRow = null;
        $endRow = null;

        foreach ($data as $rowIndex => $row) {
            foreach ($row as $cell) {
                if ($cell === $startMarker) {
                    $startRow = $rowIndex;
                }
                if ($cell === $endMarker) {
                    $endRow = $rowIndex;
                }
            }
        }

        return [$startRow, $endRow];
    }
}

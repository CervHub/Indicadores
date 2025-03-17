<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ConsolidationCreationService
{
    protected $result = [];

    public function store($request)
    {
        $this->generateConsolidated($request->year, $request->month);
        return $this->result;
    }

    private function generateConsolidated($year, $month)
    {
        $annex24 = $this->getAnnexData('annex24s', $year, $month);
        $annex25 = $this->getAnnexData('annex25s', $year, $month);
        $annex26 = $this->getAnnexData('annex26s', $year, $month);
        $annex27 = $this->getAnnexData('annex27s', $year, $month);
        $annex28 = $this->getAnnex28Data($year, $month);
        $annex30 = $this->getAnnex30Data($year, $month);
        $minem1 = $this->getMinem1Data($year, $month);
        $minem2 = $this->getMinem2Data($year, $month);

        $this->groupData($annex24, 'annex24');
        $this->groupData($annex25, 'annex25');
        $this->groupData($annex26, 'annex26');
        $this->groupData($annex27, 'annex27');
        $this->groupData($annex28, 'annex28');
        $this->groupData($annex30, 'annex30');
        $this->groupData($minem1, 'minem1');
        $this->groupData($minem2, 'minem2');
    }

    private function groupData($data, $model)
    {
        foreach ($data as $item) {
            $this->result[$item->uea_name][$model][$item->contractor_company_type_name][] = $item;
        }
    }


    private function getAnnexData($table, $year, $month)
    {
        return DB::table('file_statuses as fs')
            ->join('ueas as u', 'u.id', '=', 'fs.uea_id')
            ->join('contractor_companies as cc', 'cc.id', '=', 'fs.contractor_company_id')
            ->join('contractor_company_types as cct', 'cct.id', '=', 'fs.contractor_company_type_id')
            ->rightJoin($table . ' as a', 'a.file_status_id', '=', 'fs.id')
            ->select(
                'cct.abbreviation',
                'cct.name as contractor_company_type_name',
                'cc.name as contractor_company_name',
                'cc.ruc_number',
                'u.name as uea_name',
                'fs.year',
                'fs.month',
                DB::raw('SUM(a.empl) as total_empl'),
                DB::raw('SUM(a.obr) as total_obr'),
                DB::raw('SUM(a.day1) as total_day1'),
                DB::raw('SUM(a.day2) as total_day2'),
                DB::raw('SUM(a.day3) as total_day3'),
                DB::raw('SUM(a.day4) as total_day4'),
                DB::raw('SUM(a.day5) as total_day5'),
                DB::raw('SUM(a.day6) as total_day6'),
                DB::raw('SUM(a.day7) as total_day7'),
                DB::raw('SUM(a.day8) as total_day8'),
                DB::raw('SUM(a.day9) as total_day9'),
                DB::raw('SUM(a.day10) as total_day10'),
                DB::raw('SUM(a.day11) as total_day11'),
                DB::raw('SUM(a.day12) as total_day12'),
                DB::raw('SUM(a.day13) as total_day13'),
                DB::raw('SUM(a.day14) as total_day14'),
                DB::raw('SUM(a.day15) as total_day15'),
                DB::raw('SUM(a.day16) as total_day16'),
                DB::raw('SUM(a.day17) as total_day17'),
                DB::raw('SUM(a.day18) as total_day18'),
                DB::raw('SUM(a.day19) as total_day19'),
                DB::raw('SUM(a.day20) as total_day20'),
                DB::raw('SUM(a.day21) as total_day21'),
                DB::raw('SUM(a.day22) as total_day22'),
                DB::raw('SUM(
                    a.day1 + a.day2 + a.day3 + a.day4 + a.day5 +
                    a.day6 + a.day7 + a.day8 + a.day9 + a.day10 +
                    a.day11 + a.day12 + a.day13 + a.day14 + a.day15 +
                    a.day16 + a.day17 + a.day18 + a.day19 + a.day20 +
                    a.day21 + a.day22
                ) as total_days')
            )
            ->where('fs.year', $year)
            ->where('fs.month', $month)
            ->groupBy(
                'cct.abbreviation',
                'cct.name',
                'cc.name',
                'cc.ruc_number',
                'u.name',
                'fs.year',
                'fs.month'
            )
            ->get();
    }

    private function getAnnex28Data($year, $month)
    {
        return DB::table('file_statuses as fs')
            ->join('ueas as u', 'u.id', '=', 'fs.uea_id')
            ->join('contractor_companies as cc', 'cc.id', '=', 'fs.contractor_company_id')
            ->join('contractor_company_types as cct', 'cct.id', '=', 'fs.contractor_company_type_id')
            ->rightJoin('annex28s as a28', 'a28.file_status_id', '=', 'fs.id')
            ->select(
                'cct.abbreviation',
                'cct.name as contractor_company_type_name',
                'cc.name as contractor_company_name',
                'cc.ruc_number',
                'u.name as uea_name',
                'fs.year',
                'fs.month',
                DB::raw('SUM(a28.employees) as total_employees'),
                DB::raw('SUM(a28.workers) as total_workers'),
                DB::raw('SUM(a28.employees) + SUM(a28.workers) as total_personnel'),
                DB::raw('SUM(a28.incidents) as total_incidents'),
                DB::raw('SUM(a28.dangerous_incidents) as total_dangerous_incidents'),
                DB::raw('SUM(a28.minor_accidents) as total_minor_accidents'),
                DB::raw('SUM(a28.disability) as total_disability'),
                DB::raw('SUM(a28.mortality) as total_mortality'),
                DB::raw('SUM(a28.mortality) + SUM(a28.disability) as total_mortality_disability'),
                DB::raw('SUM(a28.lost_days) as total_lost_days'),
                DB::raw('SUM(a28.man_hours_worked) as total_man_hours_worked'),
                DB::raw('SUM(a28.frequency_index) as total_frequency_index'),
                DB::raw('SUM(a28.severity_index) as total_severity_index'),
                DB::raw('SUM(a28.accident_rate) as total_accident_rate')
            )
            ->where('fs.year', $year)
            ->where('fs.month', $month)
            ->groupBy(
                'cct.abbreviation',
                'cct.name',
                'cc.name',
                'cc.ruc_number',
                'u.name',
                'fs.year',
                'fs.month'
            )
            ->get();
    }

    private function getAnnex30Data($year, $month)
    {
        return DB::table('file_statuses as fs')
            ->join('ueas as u', 'u.id', '=', 'fs.uea_id')
            ->join('contractor_companies as cc', 'cc.id', '=', 'fs.contractor_company_id')
            ->join('contractor_company_types as cct', 'cct.id', '=', 'fs.contractor_company_type_id')
            ->rightJoin('annex30s as a30', 'a30.file_status_id', '=', 'fs.id')
            ->select(
                'cct.abbreviation',
                'cct.name as contractor_company_type_name',
                'cc.name as contractor_company_name',
                'cc.ruc_number',
                'u.name as uea_name',
                'fs.year',
                'fs.month',
                'a30.accident_type',
                'a30.injury_nature',
                'a30.age',
                'a30.marital_status',
                'a30.education_level',
                'a30.years_experience',
                'a30.time',
                'a30.day',
                'a30.month_name',
                'a30.partial_temporary',
                'a30.permanent_temporary',
                'a30.partial_permanent',
                'a30.total_permanent',
                'a30.disability',
                'a30.occupation',
                'a30.remuneration'
            )
            ->where('fs.year', $year)
            ->where('fs.month', $month)
            ->get();
    }

    private function getMinem1Data($year, $month)
    {
        return DB::table('file_statuses as fs')
            ->join('ueas as u', 'u.id', '=', 'fs.uea_id')
            ->join('contractor_companies as cc', 'cc.id', '=', 'fs.contractor_company_id')
            ->join('contractor_company_types as cct', 'cct.id', '=', 'fs.contractor_company_type_id')
            ->rightJoin('minem_template1s as mt1', 'mt1.file_status_id', '=', 'fs.id')
            ->select(
                'cct.abbreviation',
                'cct.name as contractor_company_type_name',
                'cc.name as contractor_company_name',
                'cc.ruc_number',
                'u.name as uea_name',
                'fs.year',
                'fs.month',
                'mt1.concession_code',
                'mt1.concession_name',
                'mt1.mining_activities',
                DB::raw('SUM(mt1.local_male_workers) as total_local_male_workers'),
                DB::raw('SUM(mt1.regional_male_workers) as total_regional_male_workers'),
                DB::raw('SUM(mt1.national_male_workers) as total_national_male_workers'),
                DB::raw('SUM(mt1.foreign_male_workers) as total_foreign_male_workers'),
                DB::raw('SUM(mt1.local_female_workers) as total_local_female_workers'),
                DB::raw('SUM(mt1.regional_female_workers) as total_regional_female_workers'),
                DB::raw('SUM(mt1.national_female_workers) as total_national_female_workers'),
                DB::raw('SUM(mt1.foreign_female_workers) as total_foreign_female_workers'),
                DB::raw('SUM(mt1.local_male_employees) as total_local_male_employees'),
                DB::raw('SUM(mt1.regional_male_employees) as total_regional_male_employees'),
                DB::raw('SUM(mt1.national_male_employees) as total_national_male_employees'),
                DB::raw('SUM(mt1.foreign_male_employees) as total_foreign_male_employees'),
                DB::raw('SUM(mt1.local_female_employees) as total_local_female_employees'),
                DB::raw('SUM(mt1.regional_female_employees) as total_regional_female_employees'),
                DB::raw('SUM(mt1.national_female_employees) as total_national_female_employees'),
                DB::raw('SUM(mt1.foreign_female_employees) as total_foreign_female_employees'),
                DB::raw('SUM(mt1.total_employees) as total_employees'),
                DB::raw('SUM(mt1.total_hours_employees) as total_hours_employees')
            )
            ->where('fs.year', $year)
            ->where('fs.month', $month)
            ->groupBy(
                'cct.abbreviation',
                'cct.name',
                'cc.name',
                'cc.ruc_number',
                'u.name',
                'fs.year',
                'fs.month',
                'mt1.concession_code',
                'mt1.concession_name',
                'mt1.mining_activities'
            )
            ->get();
    }

    private function getMinem2Data($year, $month)
    {
        return DB::table('file_statuses as fs')
            ->join('ueas as u', 'u.id', '=', 'fs.uea_id')
            ->join('contractor_companies as cc', 'cc.id', '=', 'fs.contractor_company_id')
            ->join('contractor_company_types as cct', 'cct.id', '=', 'fs.contractor_company_type_id')
            ->rightJoin('minem_template2s as mt2', 'mt2.file_status_id', '=', 'fs.id')
            ->select(
                'cct.abbreviation',
                'cct.name as contractor_company_type_name',
                'cc.name as contractor_company_name',
                'cc.ruc_number',
                'u.name as uea_name',
                'fs.year',
                'fs.month',
                'mt2.concession_code',
                'mt2.concession_name',
                DB::raw('SUM(mt2.male_managers) as total_male_managers'),
                DB::raw('SUM(mt2.female_managers) as total_female_managers'),
                DB::raw('SUM(mt2.male_administrative) as total_male_administrative'),
                DB::raw('SUM(mt2.female_administrative) as total_female_administrative'),
                DB::raw('SUM(mt2.male_plant_staff) as total_male_plant_staff'),
                DB::raw('SUM(mt2.female_plant_staff) as total_female_plant_staff'),
                DB::raw('SUM(mt2.male_general_operations) as total_male_general_operations'),
                DB::raw('SUM(mt2.female_general_operations) as total_female_general_operations')
            )
            ->where('fs.year', $year)
            ->where('fs.month', $month)
            ->groupBy(
                'cct.abbreviation',
                'cct.name',
                'cc.name',
                'cc.ruc_number',
                'u.name',
                'fs.year',
                'fs.month',
                'mt2.concession_code',
                'mt2.concession_name'
            )
            ->get();
    }
}

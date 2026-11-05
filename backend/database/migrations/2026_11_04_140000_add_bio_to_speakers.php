<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('speakers', function (Blueprint $table) {
            $table->text('bio')->nullable();
        });

        $bios = [
            'Dr. Sarah Johnson' => 'Pediatric nutrition specialist from the United Kingdom. She leads clinic programs on growth, feeding, and early-life nutrition.',
            'Dr. Hassan Ali' => 'Clinical research director based in the UAE. He opens the congress and connects new studies with everyday medical practice.',
            'Dr. Ahmed Khalid' => 'Gastroenterology consultant in Dubai. His work covers nutrition across hospital, clinic, and long-term care settings.',
            'Dr. Mei Chen' => 'Pediatric feeding lead from Singapore. She works with families on growth patterns and practical feeding plans.',
            'Prof. Luis Ortega' => 'Metabolic health researcher from Spain. He chairs the research roundtable on clinical trials and metabolic care.',
        ];

        foreach ($bios as $name => $bio) {
            DB::table('speakers')->where('name', $name)->update(['bio' => $bio]);
        }
    }

    public function down(): void
    {
        Schema::table('speakers', function (Blueprint $table) {
            $table->dropColumn('bio');
        });
    }
};

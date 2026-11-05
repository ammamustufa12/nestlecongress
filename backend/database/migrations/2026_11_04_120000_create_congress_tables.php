<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('congress_events', function (Blueprint $table) {
            $table->id();
            $table->string('kicker');
            $table->string('title');
            $table->string('meta');
            $table->string('date_short');
            $table->timestamps();
        });

        Schema::create('congress_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->timestamps();
        });

        Schema::create('congress_days', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('label');
            $table->string('date_label');
            $table->string('heading');
            $table->string('subtitle');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('agenda_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('congress_day_id')->constrained()->cascadeOnDelete();
            $table->string('time');
            $table->string('period', 4);
            $table->string('tag');
            $table->string('title');
            $table->string('meta');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('agenda_bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('agenda_session_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'agenda_session_id']);
        });

        Schema::create('tools', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('description');
            $table->string('category');
            $table->string('icon');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('speakers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('place');
            $table->string('talk');
            $table->string('field');
            $table->string('initials', 8);
            $table->boolean('featured')->default(false);
            $table->string('color_start');
            $table->string('color_end');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('speaker_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('speaker_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'speaker_id']);
        });

        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('date_label');
            $table->text('address');
            $table->timestamps();
        });

        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('icon');
            $table->unsignedInteger('sort')->default(0);
        });

        Schema::create('polls', function (Blueprint $table) {
            $table->id();
            $table->string('tag');
            $table->string('question');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('poll_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poll_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->unsignedInteger('votes')->default(0);
            $table->unsignedInteger('sort')->default(0);
        });

        Schema::create('poll_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('poll_id')->constrained()->cascadeOnDelete();
            $table->foreignId('poll_option_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'poll_id']);
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->string('topic');
            $table->string('status');
            $table->unsignedInteger('votes')->default(0);
            $table->text('body');
            $table->string('bucket');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('question_upvotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'question_id']);
        });

        Schema::create('congress_resources', function (Blueprint $table) {
            $table->id();
            $table->string('kind');
            $table->string('title');
            $table->string('detail');
            $table->string('size');
            $table->string('icon');
            $table->string('tint');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('resource_saves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('congress_resource_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'congress_resource_id']);
        });

        Schema::create('exhibitors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('booth');
            $table->string('focus');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('exhibitor_saves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exhibitor_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'exhibitor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exhibitor_saves');
        Schema::dropIfExists('exhibitors');
        Schema::dropIfExists('resource_saves');
        Schema::dropIfExists('congress_resources');
        Schema::dropIfExists('question_upvotes');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('poll_votes');
        Schema::dropIfExists('poll_options');
        Schema::dropIfExists('polls');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('venues');
        Schema::dropIfExists('speaker_favorites');
        Schema::dropIfExists('speakers');
        Schema::dropIfExists('tools');
        Schema::dropIfExists('agenda_bookmarks');
        Schema::dropIfExists('agenda_sessions');
        Schema::dropIfExists('congress_days');
        Schema::dropIfExists('congress_notifications');
        Schema::dropIfExists('congress_events');
    }
};

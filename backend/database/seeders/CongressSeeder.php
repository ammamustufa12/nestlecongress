<?php

namespace Database\Seeders;

use App\Models\AgendaSession;
use App\Models\CongressDay;
use App\Models\CongressEvent;
use App\Models\CongressNotification;
use App\Models\CongressResource;
use App\Models\Exhibitor;
use App\Models\Poll;
use App\Models\Question;
use App\Models\Speaker;
use App\Models\Tool;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Seeder;

class CongressSeeder extends Seeder
{
    public function run(): void
    {
        CongressEvent::create([
            'kicker' => 'FEATURED EVENT',
            'title' => "The Next Era of\nNutrition & Health",
            'meta' => 'May 22 – 23, 2026  ·  Dubai, UAE',
            'date_short' => '22 – 23 May 2026',
        ]);

        CongressNotification::create([
            'title' => 'Notifications',
            'body' => 'No new alerts. The congress opens May 22 in Dubai.',
        ]);

        $dayOne = CongressDay::create([
            'code' => 'd1', 'label' => 'Day 1', 'date_label' => 'May 22',
            'heading' => 'Day 1 Schedule', 'subtitle' => 'Thursday, May 22, 2026', 'sort' => 1,
        ]);
        $dayTwo = CongressDay::create([
            'code' => 'd2', 'label' => 'Day 2', 'date_label' => 'May 23',
            'heading' => 'Day 2 Schedule', 'subtitle' => 'Friday, May 23, 2026', 'sort' => 2,
        ]);

        $sessions = [
            [$dayOne, '08:30', 'AM', 'Keynote', 'Opening Ceremony', 'Main Auditorium'],
            [$dayOne, '09:30', 'AM', 'Keynote', 'Welcome & Introduction', 'Dr. Hassan Ali'],
            [$dayOne, '10:30', 'AM', 'Nutrition', 'Future of Pediatric Nutrition', 'Dr. Sarah Johnson'],
            [$dayOne, '01:30', 'PM', 'Research', 'Clinical Trials Update', 'Hall B'],
            [$dayTwo, '09:00', 'AM', 'Keynote', 'Clinical Nutrition Forum', 'Hall B'],
            [$dayTwo, '11:00', 'AM', 'Research', 'Research Roundtable', 'Prof. Luis Ortega'],
            [$dayTwo, '02:00', 'PM', 'Nutrition', 'Pediatric Case Discussions', 'Dr. Mei Chen'],
        ];
        foreach ($sessions as $index => [$day, $time, $period, $tag, $title, $meta]) {
            AgendaSession::create([
                'congress_day_id' => $day->id,
                'time' => $time,
                'period' => $period,
                'tag' => $tag,
                'title' => $title,
                'meta' => $meta,
                'sort' => $index + 1,
            ]);
        }

        $tools = [
            ['agenda', 'Agenda', 'View full congress schedule', 'Event', 'calendar-outline'],
            ['speakers', 'Speakers', 'Explore global medical experts', 'Event', 'people-outline'],
            ['nametag', 'Name Tag', 'Access your digital badge', 'Event', 'id-card-outline'],
            ['venue', 'Venue', 'Location, facilities and directions', 'Event', 'location-outline'],
            ['voting', 'Voting', 'Cast votes in live sessions', 'Interactive', 'stats-chart-outline'],
            ['qa', 'Ask Q&A', 'Send questions to speakers', 'Interactive', 'chatbubble-ellipses-outline'],
            ['resources', 'Resources', 'Slides, papers and downloads', 'Tools', 'folder-outline'],
            ['exhibitors', 'Exhibitors', 'Browse congress exhibitors', 'Tools', 'briefcase-outline'],
        ];
        foreach ($tools as $index => [$slug, $title, $description, $category, $icon]) {
            Tool::create([
                'slug' => $slug, 'title' => $title, 'description' => $description,
                'category' => $category, 'icon' => $icon, 'sort' => $index + 1,
            ]);
        }

        $speakers = [
            ['Dr. Sarah Johnson', 'Pediatric Nutrition Specialist', 'United Kingdom', 'Future of Pediatric Nutrition', 'Pediatrics', 'SJ', true, '#7ED0A0', '#F2C14E', 'Pediatric nutrition specialist from the United Kingdom. She leads clinic programs on growth, feeding, and early-life nutrition.'],
            ['Dr. Hassan Ali', 'Clinical Research Director', 'UAE', 'Welcome & Introduction', 'Research', 'HA', false, '#5B8DEF', '#7EB6FF', 'Clinical research director based in the UAE. He opens the congress and connects new studies with everyday medical practice.'],
            ['Dr. Ahmed Khalid', 'Gastroenterology Consultant', 'UAE', 'Nutrition Across Care Settings', 'Nutrition', 'AK', false, '#8B7CFF', '#B7A6FF', 'Gastroenterology consultant in Dubai. His work covers nutrition across hospital, clinic, and long-term care settings.'],
            ['Dr. Mei Chen', 'Pediatric Feeding Lead', 'Singapore', 'Growth Patterns in Clinic', 'Pediatrics', 'MC', false, '#F08AAE', '#F6C1D4', 'Pediatric feeding lead from Singapore. She works with families on growth patterns and practical feeding plans.'],
            ['Prof. Luis Ortega', 'Metabolic Health', 'Spain', 'Research Roundtable', 'Research', 'LO', false, '#48C2C8', '#8FE3E0', 'Metabolic health researcher from Spain. He chairs the research roundtable on clinical trials and metabolic care.'],
        ];
        foreach ($speakers as $index => $row) {
            Speaker::create([
                'name' => $row[0], 'role' => $row[1], 'place' => $row[2], 'talk' => $row[3],
                'field' => $row[4], 'initials' => $row[5], 'featured' => $row[6],
                'color_start' => $row[7], 'color_end' => $row[8], 'bio' => $row[9], 'sort' => $index + 1,
            ]);
        }

        $venue = Venue::create([
            'name' => "Dubai International\nConvention & Exhibition\nCenter",
            'date_label' => '22 – 23 May 2026',
            'address' => "World Trade Centre, Dubai,\nUnited Arab Emirates",
            'latitude' => 25.2233460,
            'longitude' => 55.2869340,
        ]);
        foreach ([
            ['Free Wi-Fi', 'wifi'],
            ['Parking', 'car-sport'],
            ['Catering', 'restaurant'],
            ['Accessible', 'accessibility'],
        ] as $index => [$label, $icon]) {
            $venue->facilities()->create(['label' => $label, 'icon' => $icon, 'sort' => $index + 1]);
        }

        $feedback = Poll::create([
            'tag' => 'Audience Feedback',
            'question' => 'How would you rate the current session?',
            'sort' => 1,
        ]);
        $feedback->options()->createMany([
            ['label' => 'Excellent', 'votes' => 55, 'sort' => 1],
            ['label' => 'Very Good', 'votes' => 31, 'sort' => 2],
            ['label' => 'Good', 'votes' => 10, 'sort' => 3],
        ]);
        $topic = Poll::create([
            'tag' => 'Session Topic',
            'question' => 'Which topic should the panel go deeper on?',
            'sort' => 2,
        ]);
        $topic->options()->createMany([
            ['label' => 'Pediatric nutrition', 'votes' => 40, 'sort' => 1],
            ['label' => 'Clinical practice', 'votes' => 28, 'sort' => 2],
            ['label' => 'Research methods', 'votes' => 18, 'sort' => 3],
        ]);

        $doctor = User::create([
            'name' => 'Dr. Testing',
            'email' => 'dr.testing@congress.com',
            'password' => 'password',
            'organization' => 'Nestlé Health Science',
            'phone' => '+971 50 100 2026',
            'location' => 'Dubai, UAE',
            'badge_id' => 'NMC-2026-014',
            'role_title' => 'Medical Congress Attendee',
            'badge_role' => 'Attendee',
            'initials' => 'DT',
            'sessions_count' => 12,
            'certificates_count' => 3,
        ]);
        $huda = User::create([
            'name' => 'Huda Latheef',
            'email' => 'huda@example.com',
            'password' => 'password',
            'organization' => 'Nestlé Health Science',
            'phone' => '+971 56 283 4212',
            'location' => 'Dubai, UAE',
            'badge_id' => 'NMC-2026-001',
            'role_title' => 'Medical Congress Attendee',
            'badge_role' => 'Flutter Developer · Attendee',
            'initials' => 'HL',
            'sessions_count' => 12,
            'certificates_count' => 3,
        ]);

        $veryGood = $feedback->options()->where('label', 'Very Good')->first();
        foreach ([$doctor, $huda] as $person) {
            $person->pollVotes()->create([
                'poll_id' => $feedback->id,
                'poll_option_id' => $veryGood->id,
            ]);
        }

        Question::create([
            'author_name' => 'Dr. Ahmed',
            'topic' => 'Nutrition',
            'status' => 'Answered',
            'votes' => 24,
            'body' => 'How can pediatric nutrition plans be personalized for children with different growth patterns?',
            'bucket' => 'Recent',
            'sort' => 1,
        ]);
        Question::create([
            'author_name' => 'Dr. Sarah Johnson',
            'topic' => 'Research',
            'status' => 'Answered',
            'votes' => 18,
            'body' => 'Which outcome measures should we track in a 12-week feeding study?',
            'bucket' => 'Popular',
            'sort' => 2,
        ]);
        Question::create([
            'user_id' => $doctor->id,
            'author_name' => 'Dr. Testing',
            'topic' => 'General',
            'status' => 'Open',
            'votes' => 9,
            'body' => 'Will session slides be available the same day?',
            'bucket' => 'Popular',
            'sort' => 3,
        ]);

        $resources = [
            ['PDF', 'Congress Scientific Program', 'Complete schedule and session details', '4.2 MB', 'document-text', '#E85D4C'],
            ['PDF', 'Pediatric Nutrition Guide', 'Clinical reference material', '2.8 MB', 'document-text', '#3B82F6'],
            ['Slides', 'Keynote Presentation', 'The Next Era of Nutrition & Health', '6.4 MB', 'easel', '#E2B03A'],
            ['Videos', 'Opening Ceremony Replay', 'Hall A recording', '48 MB', 'play-circle', '#7C5CFC'],
        ];
        foreach ($resources as $index => $row) {
            CongressResource::create([
                'kind' => $row[0], 'title' => $row[1], 'detail' => $row[2],
                'size' => $row[3], 'icon' => $row[4], 'tint' => $row[5], 'sort' => $index + 1,
            ]);
        }

        $exhibitors = [
            ['Nestlé Health Science', 'Booth A12', 'Clinical nutrition'],
            ['Gulf Medical Labs', 'Booth B04', 'Diagnostics'],
            ['Pediatric Care Co.', 'Booth C18', 'Feeding systems'],
            ['Metabolic Insights', 'Booth D02', 'Research tools'],
        ];
        foreach ($exhibitors as $index => [$name, $booth, $focus]) {
            Exhibitor::create(['name' => $name, 'booth' => $booth, 'focus' => $focus, 'sort' => $index + 1]);
        }

        $sessionIds = AgendaSession::query()->orderBy('sort')->limit(2)->pluck('id');
        $resourceIds = CongressResource::query()->orderBy('sort')->limit(2)->pluck('id');
        $exhibitorId = Exhibitor::query()->orderBy('sort')->value('id');
        foreach ([$doctor, $huda] as $person) {
            $person->bookmarkedSessions()->sync($sessionIds);
            $person->savedResources()->sync($resourceIds);
            $person->savedExhibitors()->sync([$exhibitorId]);
        }
    }
}

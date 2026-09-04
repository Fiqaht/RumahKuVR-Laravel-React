<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_message_can_be_saved(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'subject' => 'FYP enquiry',
            'message' => 'I would like to know more about RumahKuVR.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseCount('contact_messages', 1);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:160'],
            'subject' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        $apiKey = config('resend.api_key');
        $fromAddress = config('resend.from_address');
        $fromName = config('resend.from_name');
        $receiver = config('resend.contact_receiver');

        if (!$apiKey || !$receiver) {
            Log::error('Resend configuration is incomplete.');

            return response()->json([
                'message' => 'Email service is not configured.',
            ], 500);
        }

        $safeName = e($data['name']);
        $safeEmail = e($data['email']);
        $safeSubject = e($data['subject']);
        $safeMessage = nl2br(e($data['message']));

        $response = Http::withToken($apiKey)
            ->acceptJson()
            ->post('https://api.resend.com/emails', [
                'from' => "{$fromName} <{$fromAddress}>",
                'to' => [$receiver],
                'reply_to' => $data['email'],
                'subject' => "[RumahKuVR Contact] {$data['subject']}",
                'html' => "
                    <h2>New RumahKuVR Contact Message</h2>

                    <p><strong>Name:</strong> {$safeName}</p>
                    <p><strong>Email:</strong> {$safeEmail}</p>
                    <p><strong>Subject:</strong> {$safeSubject}</p>

                    <hr>

                    <p><strong>Message:</strong></p>
                    <p>{$safeMessage}</p>
                ",
            ]);

        if ($response->failed()) {
            Log::error('Resend email failed.', [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return response()->json([
                'message' => 'Unable to send message right now.',
            ], 502);
        }

        return response()->json([
            'message' => 'Message sent successfully. Thank you!',
        ], 201);
    }
}

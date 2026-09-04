<?php

return [
    'api_key' => env('RESEND_API_KEY'),

    'from_address' => env(
        'RESEND_FROM_ADDRESS',
        'contact@rumahkuvr.app'
    ),

    'from_name' => env(
        'RESEND_FROM_NAME',
        'RumahKuVR'
    ),

    'contact_receiver' => env('CONTACT_RECEIVER_EMAIL'),
];

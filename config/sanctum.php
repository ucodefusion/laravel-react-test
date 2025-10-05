<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf('%s:%s', parse_url(env('APP_URL'), PHP_URL_HOST) ?? 'localhost', parse_url(env('APP_URL'), PHP_URL_PORT) ?? '80'))),
    'expiration' => null,
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];

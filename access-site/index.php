<?php
/**
 * Blocking the site for people who do not enter through a specific url.
 * Access lasts for the duration of the php session, or after inactivity time set by the editor
 */

// Start session
session_start();

function redirect_based_on_access_and_inactivity()
{
    $access_urls = get_field('access_urls', 'options'); // Get URLs, who have access to site
    $blank_page = get_field('blank_page', 'options'); // Get page which will be our blank page for people who dont have access
    $time_to_close_session = get_field('inactivity', 'options') ?: 30; // Get time close the session after inactivity (default 30 minutes)
    $request_uri = filter_input(INPUT_SERVER, 'REQUEST_URI', FILTER_SANITIZE_URL);

    if ( is_user_logged_in() || !$blank_page || is_page($blank_page) ) {
        return;
    }

    if ( in_array($request_uri, array_column($access_urls, 'url'), true) ) {
        wp_redirect(home_url(), 301);
        $_SESSION["show_content"] = 'true';
        $_SESSION['timeout'] = time();
        return;
    }

    if ( !isset($_SESSION["show_content"]) || (time() - $_SESSION['timeout']) > $time_to_close_session*60 ) {
        // If have not $_SESSION["show_content"], or inactivity is more than 30 minutes, redirect to blank page and close access to site
        session_unset();
        session_destroy();
        wp_redirect(get_page_link($blank_page), 301);
        return;
    }

    $_SESSION['timeout'] = time();
}
add_filter('template_redirect', 'redirect_based_on_access_and_inactivity');
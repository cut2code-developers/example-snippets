<?php
$slug = 'acf-single-media-player';
$dir_path = "/parts/gutenberg/$slug";

wp_register_script( $slug, get_theme_file_uri( "$dir_path/index.min.js" ), [ ], filemtime( get_theme_file_path( "$dir_path/index.min.js" ) ), true );

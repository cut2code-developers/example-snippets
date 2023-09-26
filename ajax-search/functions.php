<?php
/**
 * Load Blocks Script
 */
if ( ! function_exists( 'load_blocks_script' ) ) {
	function load_blocks_script( $path, $name, $deps = [], $base = 'parts/components' ) {
		add_action( 'wp_footer', function() use ( $path, $name, $deps, $base ) {
			wp_enqueue_script(
				$name,
				get_theme_file_uri( "/$base/$path/index.min.js" ),
				$deps,
				filemtime( get_theme_file_path( "/$base/$path/index.min.js" ) ),
				true
			);
		}, 1);
	}
}

/**
 * Load Inline Styles
 */
if ( ! function_exists( 'load_inline_styles' ) ) {

	function load_inline_styles( $path, $key, $file_name = 'style' ) {
		global $styles_arr;
		global $filter_arr;

		$theme_info = wp_get_theme();
		$theme_root = get_theme_root();
		$replaces   = [ realpath( "$theme_root/$theme_info->stylesheet" ) ];

		if ( $theme_info->stylesheet !== $theme_info->template ) {
			$replaces[] = realpath( "$theme_root/$theme_info->template" );
		}

		if ( false !== realpath( $path ) ) {
			$path = str_replace( $replaces, '', realpath( $path ) );
		}

		$file = realpath( get_theme_file_path( "$path/$file_name.css" ) );

		if ( ! in_array( $key, $styles_arr ) && file_exists( $file ) && ! in_array( $key, $filter_arr ) ) {
			$style = file_get_contents( $file );

			if ( ! empty($style) ) {
				$style = check_styles_urls( $style );

				array_push( $styles_arr, $key );

				?><style><?php echo $style; ?></style><?php
			}
		}
	}
}

/**
 * Replace CSS Image Url
 */
if ( ! function_exists( 'check_styles_urls' ) ) {

	function check_styles_urls( $string ) {
		$path    = get_theme_file_uri( '/assets/images' );
		$url     = "url($path$3)";
		$pattern = '/url\s*\(\s*[\'"]?(?!(((?: https?: )?\/\/)|(?: data\: ?: )|(?: #)))([^\'"\)]+)[\'"]?\s*\)/i';

		return preg_replace( $pattern, $url, $string );
	}

}

/**
 * Localize Vars Scripts
 */
if ( ! function_exists( 'localize_vars_scripts' ) ) {

	function localize_vars_scripts() {

		wp_localize_script( 'dynamic/search', 'vars', [
			'homeUrl'     => home_url(),
		] );
	}

}

add_action( 'wp_enqueue_scripts', 'localize_vars_scripts' );

/**
 * Ajax Search with REST API
 */
add_action('rest_api_init', function () {
	register_rest_route('dynamic/v1', '/search/', array(
		'methods' => 'GET',
		'callback' => 'dynamic_ajax_search',
		'permission_callback' => '__return_true',
	));
});

if ( ! function_exists( 'dynamic_ajax_search' ) ) {
	function dynamic_ajax_search( WP_REST_Request $request ) {
		// Get the search query from the request
		$query = sanitize_text_field($request->get_param('query'));

		// Perform the search query
		$posts = get_posts(array(
			's' => $query,
			'post_type' => 'any',
			'numberposts' => 3,
		));

		// Prepare the posts for the response
		$data = array_map(function ($post) {
		$id = $post->ID;
		$link = get_permalink($id);
		$title = get_the_title($id);

		return array(
			'html' => "<li class='results__item'><a class='results__link' href='" . $link . "'>" . $title . "</a></li>",
		);
		}, $posts);

		wp_reset_postdata();

		// Return the response
		return new WP_REST_Response($data, 200);
	}
}
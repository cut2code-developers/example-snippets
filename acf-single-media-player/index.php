<?php
/**
 * Block [single] media player
 *
 * @package WordPress
 * @subpackage themeName
 * @since themeName 1.0
 */
$block_object    = new Block( $block );
$attr            = $block_object->attr( 'alignfull' );
$name            = $block_object->name();
$number_of_media = 0;
$title           = '';
$sub_title       = '';
?>

<section <?php echo $attr; ?>>
	<?php echo load_inline_styles( __DIR__, $name ); ?>
	<div class="container container--narrow <?php echo esc_attr( $name ); ?>__container">
		<div class="<?php echo esc_attr( $name ); ?>__content">

			<?php $media_file = get_field( 'media_file' ); ?>

			<?php if ( have_rows( 'media_files' ) ) : ?>
				<?php $json_data = array(); ?>
				<?php while ( have_rows( 'media_files' ) ) : the_row(); ?>
					<?php
					$title          = wp_kses_post( get_sub_field( 'title' ) );
					$sub_title      = wp_kses_post( get_sub_field( 'sub_title' ) );
					$media_file     = get_sub_field( 'media_file' );
					$media_file_url = esc_html( $media_file['url'] );

					$json_data[] = array(
						'title'    => $title,
						'subtitle' => $sub_title,
						'media'    => $media_file_url,
					);
					?>
					<?php $number_of_media++; ?>
				<?php endwhile; ?>

				<input type="hidden" class="<?php echo esc_attr( $name ); ?>-data" value="<?php echo htmlspecialchars( json_encode( $json_data ) ); ?>">
			<?php endif; ?>

			<?php if ( ! empty( $media_file ) ) : ?>

				<div class="<?php echo esc_attr( $name ); ?>__player">
					<div class="<?php echo esc_attr( $name ); ?>__player--details">
						<div class="<?php echo esc_attr( $name ); ?>__player--title track-name">Nazwa utworu</div>
						<div class="<?php echo esc_attr( $name ); ?>__player--subtitle track-artist">Nazwa artysty</div>
						<div class="now-playing<?php if ( 1 === $number_of_media ) : ?> d-none<?php endif; ?>">Część X z X</div>
					</div>

					<div class="<?php echo esc_attr( $name ); ?>__player--buttons">
						<button class="prev-track<?php if ( 1 === $number_of_media ) : ?> d-none<?php endif; ?>"><?php echo get_img( 'step-forward-prev' ); ?></button>
						<button class="playpause-track"><?php echo get_img( 'play' ); ?></button>
						<button class="next-track<?php if ( 1 === $number_of_media ) : ?> d-none<?php endif; ?>"><?php echo get_img( 'step-forward-next' ); ?></button>
						<button class="repeat-track"><?php echo get_img( 'repeat' ); ?></button>
					</div>

					<div class="<?php echo esc_attr( $name ); ?>__player--slider">
						<div class="<?php echo esc_attr( $name ); ?>__player--timeline">
							<div class="current-time">00:00</div>
							<input type="range" min="1" max="100" value="0" class="seek_slider">
							<div class="total-duration">00:00</div>
						</div>
						<div class="<?php echo esc_attr( $name ); ?>__player--volume">
							<div class="volume-down"><?php echo get_img( 'volume-down' ); ?></div>
							<input type="range" min="1" max="100" value="100" class="volume_slider">
							<div class="volume-up"><?php echo get_img( 'volume-up' ); ?></div>
						</div>
					</div>
				</div>

			<?php endif; ?>

		</div>
	</div>
</section>

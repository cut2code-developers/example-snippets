<?php
/**
 * Block with Matter Tags Animation
 *
 * @package WordPress
 * @subpackage themeName
 * @since themeName 1.0
 */
$block_object = new Block( $block );
$attr  = $block_object->attr( 'alignfull' );
$name  = $block_object->name();
?>

<section <?php echo $attr; ?>>
	<?php load_inline_styles( __DIR__, $name ); ?>
	<div class="<?php echo esc_attr( $name ); ?>__container">
	<?php
		if( have_rows( 'tags' ) ) {
			$json_data = array();
	?>
			<div class="<?php echo esc_attr( $name ); ?>__tags">
			<?php
				while ( have_rows( 'tags' ) ) {
					the_row();
					$tag_title      = get_sub_field( 'title');

					if ( ! empty( $tag_title ) ) {
						$tag_text_color = get_sub_field( 'text_color') ? get_sub_field( 'text_color') : "#ffffff";
						$tag_bg_color   = get_sub_field('bg_color') ? get_sub_field('bg_color') : "#000000";

						$json_data[] = array(
							'title' => $tag_title,
							'color' => $tag_text_color,
							'bg' => $tag_bg_color,
						);
					}
				}
				?>
				<input type="hidden" class="matter-tags__tags-data" value="<?php echo htmlspecialchars(json_encode($json_data)); ?>">
				<?php
			?>
			</div>
			<?php
		}

		if ( $title = get_field( 'title' ) ) {
			?><h2 class="<?php echo esc_attr( $name ); ?>__title <?php echo esc_attr( $name ); ?>__title--desktop has-xx-large-font-size"><?php echo wp_kses_post( $title ); ?></h2><?php
		}

		if ( $title_mobile = get_field( 'title_mobile' ) ) {
			?><h2 class="<?php echo esc_attr( $name ); ?>__title <?php echo esc_attr( $name ); ?>__title--mobile has-xx-large-font-size"><?php echo wp_kses_post( $title_mobile ); ?></h2><?php
		}

		if ( $description = get_field( 'description' ) ) {
			?><div class="<?php echo esc_attr( $name ); ?>__description"><?php echo apply_filters( 'the_content', $description ); ?></div><?php
		}
	?>
	</div>
</section>

<?php
load_blocks_script('search', 'dynamic/search');
?>
<div class="search-container">
    <?php load_inline_styles(__DIR__, 'search'); ?>
    <label for="search-input" id="search-label"><?php echo esc_attr__('Search', 'text-domain'); ?></label>
    <input type="text" id="search-input" aria-labelledby="search-label" placeholder="<?php echo esc_attr__('Type to search...', 'text-domain'); ?>" />
</div>
<div id="search-results" class="mega-menu" role="region" aria-live="polite">
    <!-- Search results will be appended here -->
</div>
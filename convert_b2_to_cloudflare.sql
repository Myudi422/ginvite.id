-- SQL Script to fix/convert direct Cloudflare URLs (file.legalpilar.id) 
-- to the correct path-prefixed URLs (file.legalpilar.id/file/ccgnimex).
-- This script handles both escaped slashes (\/) in JSON fields and regular slashes (/) in standard text fields.
-- This script is idempotent (safe to run multiple times without duplicating '/file/ccgnimex/').

-- 1. Update theme table
UPDATE theme SET
    default_bg_image = REPLACE(REPLACE(default_bg_image, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/'),
    background = REPLACE(REPLACE(background, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/'),
    default_bg_image1 = REPLACE(REPLACE(default_bg_image1, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/'),
    decorations_top_left = REPLACE(REPLACE(decorations_top_left, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/'),
    decorations_top_right = REPLACE(REPLACE(decorations_top_right, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/'),
    decorations_bottom_left = REPLACE(REPLACE(decorations_bottom_left, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/'),
    decorations_bottom_right = REPLACE(REPLACE(decorations_bottom_right, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/'),
    image_theme = REPLACE(REPLACE(image_theme, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/');

-- 2. Update musik table
UPDATE musik SET
    link_lagu = REPLACE(REPLACE(link_lagu, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/');

-- 3. Update builder_images table
UPDATE builder_images SET
    file_url = REPLACE(REPLACE(file_url, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/');

-- 4. Update builder_pages table (JSON content: handles both regular and escaped slashes)
UPDATE builder_pages SET
    page_data = REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(page_data, 'file.legalpilar.id\\/file\\/ccgnimex\\/', 'file.legalpilar.id\\/'),
                'file.legalpilar.id\\/',
                'file.legalpilar.id\\/file\\/ccgnimex\\/'
            ),
            'file.legalpilar.id/file/ccgnimex/',
            'file.legalpilar.id/'
        ),
        'file.legalpilar.id/',
        'file.legalpilar.id/file/ccgnimex/'
    );

-- 5. Update content_user table (JSON content: handles both regular and escaped slashes)
UPDATE content_user SET
    content = REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(content, 'file.legalpilar.id\\/file\\/ccgnimex\\/', 'file.legalpilar.id\\/'),
                'file.legalpilar.id\\/',
                'file.legalpilar.id\\/file\\/ccgnimex\\/'
            ),
            'file.legalpilar.id/file/ccgnimex/',
            'file.legalpilar.id/'
        ),
        'file.legalpilar.id/',
        'file.legalpilar.id/file/ccgnimex/'
    );

-- 6. Update blogs table (handles both regular and escaped slashes)
UPDATE blogs SET
    content = REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(content, 'file.legalpilar.id\\/file\\/ccgnimex\\/', 'file.legalpilar.id\\/'),
                'file.legalpilar.id\\/',
                'file.legalpilar.id\\/file\\/ccgnimex\\/'
            ),
            'file.legalpilar.id/file/ccgnimex/',
            'file.legalpilar.id/'
        ),
        'file.legalpilar.id/',
        'file.legalpilar.id/file/ccgnimex/'
    ),
    image_url = REPLACE(REPLACE(image_url, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/');

-- 7. Update blog_images table
UPDATE blog_images SET
    file_url = REPLACE(REPLACE(file_url, 'file.legalpilar.id/file/ccgnimex/', 'file.legalpilar.id/'), 'file.legalpilar.id/', 'file.legalpilar.id/file/ccgnimex/');

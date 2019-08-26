$(function() {
    $('.lazy').Lazy({ effect: 'fadeIn', });
    $.scrollify({
        section: ".intro",
        interstitialSection: '.footer',
    });

    $(".internal-link").on("click", function() {
        $.scrollify.move($(this).attr("href"));
        return false;
    });

    // Close mobile & tablet menu on item click
    $('.navbar-item').each(function(e) {
        $(this).click(function() {
            if ($('#navbar-burger-id').hasClass('is-active')) {
                $('#navbar-burger-id').removeClass('is-active');
                $('#navbar-menu-id').removeClass('is-active');
                $('#navbar-burger-id').removeClass('is-transparent-color');
            }
        });
    });

    // Open or Close mobile & tablet menu
    $('#navbar-burger-id').click(function() {
        if ($('#navbar-burger-id').hasClass('is-active')) {
            $('#navbar-burger-id').removeClass('is-active');
            $('#navbar-menu-id').removeClass('is-active');
            $('#navbar-menu-id').removeClass('is-transparent-color');
        } else {
            $('#navbar-burger-id').addClass('is-active');
            $('#navbar-menu-id').addClass('is-transparent-color');
            $('#navbar-menu-id').addClass('is-active');
        }
    });
});
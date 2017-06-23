/**
 * Created by yih on 30.1.17.
 */
//$(".underpost_panel a").first().

function get_likes(id, event) {
    event.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/posts/' + 'get_likes',
        data: 'post_id=' + id,

        success: function(data) {


            $('#fa_likes' + id).html('<span>' + data.count + '</span>');
        }
    });

}

function resend_email(email) {

    $.ajax({
        method: 'POST',
        url: '/resend_email/' + email,
        success: function(data) {

            $('#div_resend_email').html(data);
        }
    });
}

function userComments(id) {
    var data = 'id=' + id;
    $.ajax({
        type: 'POST',

        data: data,
        url: '/usercomments',
        success: function(data) {
            $('#user_comments' + id).html('');
            data.forEach(function(item, i, arr) {
                    $('#user_comments' + id).append("<a href='/post/" + item.post_id + "/#comment_" + item._id + "'>" + item.post.substring(0, 70) + "<a><br>");
                }


            )

        }


    });
}

function load_full_text(self, event) {
    event.preventDefault();

    var href_ = $(self).attr('href');


    var url = '/fulltext/' + href_;
    if ($(self).attr('id') == 'load_full_text') {
        $.ajax({
            type: 'POST',

            // data: href_,
            url: url,
            success: function(data) {
                $('#teaser_' + href_).hide();


                $('#fulltext_' + href_).append(data);
            }


        });
        $(self).attr('id', 'full_text_up');
        $(self).text('Свернуть');
        return false;
    } else if ($(self).attr('id') == 'full_text_up') {
        $('#fulltext_' + href_).hide();
        $('#teaser_' + href_).show();
        $(self).attr('id', 'full_text_down');
        $(self).text('Читать текст полностью');
        $(document).scrollTop($(self).offset().top);
    } else if ($(self).attr('id') == 'full_text_down') {
        $('#fulltext_' + href_).show();
        $('#teaser_' + href_).hide();
        $(self).attr('id', 'full_text_up');
        $(self).text('Свернуть');
        $(document).scrollTop($('#post_start' + href_).offset().top);
    }
}

function load_tags() {
    $.ajax({
        type: 'POST',

        // data: href_,
        url: '/posts/get_tags',
        success: function(data) {

            var sizeDelim = findFontSize(data);
            var tag_list = $("#tag_list");
            var tag_sky = $("#tag_sky");
            data.forEach(function(item, i, arr) {
                var fontSize = parseInt(item.weight) * sizeDelim;
                if (fontSize < 12) fontSize = 12;

                if (tag_list) tag_list.append("-<a href='#' onclick='tagToLine(event,this)' style='font-size: " + fontSize + "px'>" + item.tag + '</a>');
                tag_sky.append("-<a href='/posts/tag/" + item.tag + "' style='font-size: " + fontSize + "px'>" + item.tag + '</a>');
            });
        }
    });

}

function show_tags(event, self) {


    if (self.innerText == String.fromCharCode(0x25BC)) {

        self.innerText = String.fromCharCode(0x25B2);
        $("#tag_list").show("fast", function() {
            // Animation complete.
        });
    } else if (self.innerText == String.fromCharCode(0x25B2)) {
        self.innerText = String.fromCharCode(0x25BC)
        $("#tag_list").hide("fast", function() {
            // Animation complete.
        });
    }

}

function findFontSize(data) {
    var max = 0;
    data.forEach(function(item, i, arr) {
        if (parseInt(item.weight) > max) max = item.weight;
    })

    return 64 / max;
}

function tagToLineTextArea(self) {

    if ($(self).val().trim() != '') $('#tags_line').html($('#tags_line').html() + '<span> |' + $(self).val() + '</span>');
    $(self).val('');
}

function tagToLine(event, self) {
    event.preventDefault();
    $('#tags_line').html($('#tags_line').html() + '<span> |' + self.innerText + '</span>');



}

$(document).ready(function() {
    load_tags();
    if ($("#tag_list")) $("#tag_list").hide("fast", function() {});
    $('#tags_line').on('click', 'span', function() {
        $(this).remove();
    });
    $('#tags_line').css('cursor', 'pointer');
    $('#tags_line').on('mouseenter', 'span', function() {
        $(this).css('background', 'red');
    });
    $('#tags_line').on('mouseleave', 'span', function() {
        $(this).css('background', 'none');
    });
})

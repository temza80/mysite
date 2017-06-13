/**
 * Created by yih on 30.1.17.
 */
//$(".underpost_panel a").first().
function resend_email(email)
{

        $.ajax({
            method:'POST',
            url: '/resend_email/'+email,
            success: function (data) {

                $('#div_resend_email').html(data.count);
            }
        });
}
function load_tags(self,event)
{
     $.ajax({
            type: 'POST',

            // data: href_,
            url: '/posts/get_tags',
            success: function (data) {
                arr.forEach(function(item, i, arr) {
 $("#tag_list").append("-"+item.tag);
});
            


        });

}
function load_full_text(self,event) {
        event.preventDefault();

        var href_ = $(self).attr('href');


        var url = '/fulltext/' + href_;
    if($(self).attr('id')=='load_full_text') {
        $.ajax({
            type: 'POST',

            // data: href_,
            url: url,
            success: function (data) {
             $('#teaser_'+href_).hide();


                $('#fulltext_' + href_).append(data);
            }


        });
        $(self).attr('id','full_text_up');
        $(self).text('Свернуть');
        return false;
    }
    else if($(self).attr('id')=='full_text_up'){
        $('#fulltext_'+href_).hide();
        $('#teaser_'+href_).show();
        $(self).attr('id','full_text_down');
        $(self).text('Читать текст полностью');
        $(document).scrollTop( $(self).offset().top );
    }
    else if($(self).attr('id')=='full_text_down'){
        $('#fulltext_'+href_).show();
        $('#teaser_'+href_).hide();
        $(self).attr('id','full_text_up');
        $(self).text('Свернуть');
        $(document).scrollTop( $('#post_start'+href_).offset().top );
    }
}

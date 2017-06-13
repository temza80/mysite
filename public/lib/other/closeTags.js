/**
 * Created by yih on 26.2.17.
 */
module.exports.closeAndSpecs=function(req,res,next) {
req.body.posting=closetags(req.body.posting,/<(i|\/i|s|\/s|b|\/b)>/gi);
req.body.posting=htmlspecialchars(req.body.posting);
req.body.title=htmlspecialchars(req.body.title);
if (req.body.posting == '' || req.body.title == '' || !req.body.title || !req.body.posting) return next(new Error('Недопустимые значения'));
else next();
}

    function closetags(str,re) {
    console.log('str='+str);
    // var re = /[<i>|</i>]/g;
    var open={};
    open['<i>']=open['<s>']=open['<b>']=0;


    while ((match =re.exec(str)) != null) {

        if(match[0].indexOf('/')==-1){
            open[match[0]]++;

        }

        else if(match[0].indexOf('/')!=-1)
        {

            var tag='<'+match[0].slice(2);

            if(typeof open[tag]!='undefined' && open[tag]>0) open[tag]--;
        }

    }

    for(var ArrVal in open) {

        if(open[ArrVal]>0) {
            var closetag='</'+ArrVal.slice(1);
            for (li=0;li<open[ArrVal];li++) {str+=closetag;console.log('close-'+closetag)}
        }

    }



    return str;
}
function htmlspecialchars(html) {

    //  html = html.replace(/&/g, "&amp;");
    html = html.replace(/\r\n/g, "<br>");

    html = html.replace(/</g, "&lt;");
    html = html.replace(/>/g, "&gt;");
    //html = html.replace(/"/g, "&quot;");

    html = html.replace(/&lt;((?:i|s|b|a|br|\/i|\/s|\/b|\/a))&gt;/gi, '<$1>');

    html = html.replace(/&lt;((?:img src|a href).*?)&gt;/gi, '<$1>');
    return html;

}
module.exports.closeTags=closetags;

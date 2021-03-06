document.write("<scr"+"ipt language=javascript src='js/jquery.alerts.js'></scr"+"ipt>");
document.write("<link href='css/jquery.alerts.css' rel='stylesheet' type='text/css' />");

var buttonDeffered = false;

function countWords (textStr) {
    textStr = textStr.replace(/(<([^>]+)>)/gi, "");
    textStr = textStr.replace(/&nbsp;/ig, " ");
    textStr = textStr.replace(/&quot;/ig, " ");
    textStr = textStr.replace(/&rsquo;/ig, " ");
    
    var initial_whitespace_rExp = /^[^A-Za-z0-9]+/gi;
    var left_trimmedStr = textStr.replace(initial_whitespace_rExp, "");
    var non_alphanumerics_rExp = /[^A-Za-z0-9]+/gi;
    var cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ");

    var splitString = cleanedStr.split(" ");
    var wordCount = splitString.length - 1;
    if (wordCount < 0)
        wordCount = 0;
    return wordCount;
}

(function($){
    // IE does not support string.trim()
    String.prototype.trim = function(){
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    //var exceedWordPrompts = $.i18n.message('common.js.alert.exceedwords');
    //var lessWordPrompts = $.i18n.message('common.js.alert.lesswords');

    $(document).bind('ready', function(){
        if (buttonDeffered) return;

        var btns = $('button.iamdone');
        var funcs = [];
        for (var i=0; i<btns.size(); i++){
            var btn = btns[i];
            $(btn).attr('ordinal', i);
            funcs.push(btn.onclick);
            btn.onclick = null;
            $(btn).click(function(){
                var form = $('form').has(this);
                var prompts = $.i18n.message('common.js.alert.sumbitassignment');
                var toolType = parseInt($("#tasktypeHidden").val());

                if (toolType == 1 || toolType == 2 || toolType == 3) { // for journal create, edit, and review tools
                    var minWords=parseInt($("#hiddenMinWords").val());
                    var maxWords=parseInt($("#hiddenMaxWords").val());
                    
                    var text = CKEDITOR.instances.journaleditor.getData();
                    var wordCount = 0;
                    
                    if (text != null) {
                        wordCount = countWords(text);
                    }

                    // Check word count and enforce word count limit.
                    // NOTE, only check the count limitation for journal create tool.
                

                    if(maxWords != 0 && (wordCount < minWords || wordCount > maxWords)){
                        if(wordCount < minWords){
                            prompts = $.i18n.message('common.js.alert.lesswords', [wordCount, minWords]);
                        } else if(wordCount > maxWords) {
                            prompts = $.i18n.message('common.js.alert.exceedwords', [wordCount, maxWords]);
                        }
                        
                        //prompts = prompts.replace(/MINWORDS/gi, minWords );
                        //prompts = prompts.replace(/MAXWORDS/gi, maxWords);
                       // prompts = prompts.replace(/CUR_WORDS/gi, wordCount);
                        
                        jAlert(prompts, $.i18n.message('common.js.alert.title.warn'), null);
                        return false;
                    }
                }
                
                // apply configurable variables
                $.alerts.okButton = $(this).attr('okButton') || $.alerts.okButton;
                $.alerts.cancelButton = $(this).attr('cancelButton') || $.alerts.cancelButton;
                prompts = $(this).attr('prompt') || prompts;

                var button = this;
                jConfirm(prompts, $.i18n.message('common.js.alert.title.confirm'), function(choice) {
                    if (choice){
                        var func = funcs[parseInt($(button).attr('ordinal'))];
                        if (func){
                            var retval = func();
                            if (retval == null || retval.toString() == "true") {
                                form.submit();
                            }
                        } else {
                            form.submit();
                        }
                    }
                });
                return false;
            })
        }
    });
})(jQuery);

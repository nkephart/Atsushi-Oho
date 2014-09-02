// Tag-list generator

(function($) {
  $.fn.tagListGen = function() {
  
    var $this = null,
    tags = [],
    tagsList = [], 
    tagsSeen = {},
    tagsSorted = [],
    postsTotal = 0, 
    postsCount = 0,
    tag = '', 
    url = 'thereveriebook.tumblr.com';
    key = 'IXFjOnZNoyT1rq6jbXMrh5ILAfEvtS7ajQwnJ1dzkJqpJWG0MW';
  
    function requestTags() {
      $this.append(
        $('<span>').attr({
          class: 'page-linker'
        })
        .html('Loading&hellip;')
      );
      $.ajax({
        url: 'http://api.tumblr.com/v2/blog/' + url + '/posts?api_key=' + key,
        dataType: 'JSONP',
        data: {offset: postsCount},
        success: processResponse
      });
    }

    function processResponse(data) {
      $this.empty();
      $.each(data.response.posts, function(idx, post) {
        if (post.tags && post.tags.length) {
          for (var i = 0; i < post.tags.length; i++) {
            tag = post.tags[i].replace(' ', '');
            if (tagsSeen[tag]) {
              tagsList[tagsSeen[tag]].count++;
            } else {
              tagsSeen[tag] = tagsList.length;
              tagsList.push({
                count: 1,
                original: post.tags[i]
              });
            }
          }
        }
      });
            
      // test if we need to fire up another request, generate output if not
      postsTotal = data.response.blog.posts || 0;
      if (postsCount < postsTotal) {
        postsCount += 20;
        requestTags();
      } else {
        renderTags();
      }
    }

    function renderTags() {

      // sort tags by frequency
      tagsSorted = tagsList.sort(function(a, b) {
        return b.count - a.count;
      });
      
      $this.empty();
      $.each(tagsSorted, function(idx, t) {
        $this.append(
          $('<a>').attr({
              href: 'http://' + url + '/tagged/' + t.original,
              class: 'page-linker',
              title: t.original
          })
          .html('#'+t.original+'&nbsp;&nbsp;&nbsp;')
        );
      });
    }

    return this.each(function() {
      $this = $(this);
      requestTags();
    });
  };
})(jQuery);


// Contact-form checker

function checkForm(){
  var status=false;     
  var emailRegEx=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  if(document.forms['ss-form']['entry.1902549149'].value=="" && document.forms['ss-form']['entry.441788654'].value==""){
    $('#ss-submit').replaceWith($('#ss-submit').clone(true));
    $('#ss-submit').addClass('shake');
    $('.form-name,.form-email').addClass('form-warning');
    $('.form-name').attr('placeholder','Name required');
    $('.form-email').attr('placeholder','E-mail address required');
  }
  else if(document.forms['ss-form']['entry.1902549149'].value==""){
    $('#ss-submit').replaceWith($('#ss-submit').clone(true));
    $('#ss-submit').addClass('shake');
    $('.form-email').removeClass('form-warning');
    $('.form-name').attr('placeholder','Name required');
  }
  else if(document.forms['ss-form']['entry.441788654'].value==""){
    $('#ss-submit').replaceWith($('#ss-submit').clone(true));
    $('#ss-submit').addClass('shake');
    $('.form-name').removeClass('form-warning');
    $('.form-email').addClass('form-warning');
    $('.form-email').attr('placeholder','E-mail address required');
  }
  else if(document.forms['ss-form']['entry.441788654'].value.search(emailRegEx)==-1){
    $('#ss-submit').replaceWith($('#ss-submit').clone(true));
    $('#ss-submit').addClass('shake');
    $('.form-name').removeClass('form-warning');
    $('.form-email').addClass('form-warning');
  }
  else{
    status=true;
    $('#ss-submit').addClass('sent').attr('disabled',true);
    $('.form-name,.form-email').removeClass('form-warning');
    setTimeout(function(){$('#ss-submit').html('Message sent')},300);
  }
  return status;
}

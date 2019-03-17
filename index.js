$(function(){
  $("main").css("margin-left",$("header").width()+"px");
  // $("#nav-playlists").hide();
  // $("#playlist-a").click(function(){
  //   $("#playlist-a > i").toggleClass("active");
  //   $("#nav-playlists").slideToggle();
  // });
  // $("#authorization-overlay").hide();
  $(document).keydown(function(e){
    if(e.which == 27){
      $("#authorization-overlay").hide();
    }
  });

  function initTimeout(){
    activeBackground(true);
    $("main").css("margin-left",$("header").width()+"px");
  }

  initTimeout();
  setTimeout(initTimeout,500);

  var oldActiveAnchor = 0;
  $("a.nav").click(function(){
    if(!$(this).is("a.nav.active")){
      oldActiveAnchor = $("a.nav").eq($("a.nav.active").first().index());
      $("a.nav.active").removeClass("active");
      $(this).addClass("active");
      activeBackground();
    }
  });
  function activeBackground(init=false){
    let activeAnchor = $("a.nav.active").first();
    let oldActiveSection = init?0:$(oldActiveAnchor.attr("data-section"));
    let activeSection = $(activeAnchor.attr("data-section"));
    if(init){
      $("#active-background").offset({top:activeAnchor.offset().top-$(window).scrollTop(), left:activeAnchor.offset().left-$(window).scrollLeft()});
    } else {
      $("#active-background").animate({top:activeAnchor.offset().top-$(window).scrollTop(), left:activeAnchor.offset().left-$(window).scrollLeft()},250);
    }
    $("#active-background").prependTo(activeAnchor);
    $("#active-background").width(activeAnchor.outerWidth());
    $("#active-background").height(activeAnchor.outerHeight());
    if(init){
      $(".section").hide();
      activeSection.show();
    } else{
      // $("html,body").css("overflow","hidden");
      activeSection.removeClass("fadeInUp fadeInDown fadeOutUp fadeOutDown animated active").show().css("width", activeSection.width());
      oldActiveSection.removeClass("fadeInUp fadeInDown fadeOutUp fadeOutDown animated").show().css("width", oldActiveSection.width());
      if(oldActiveAnchor.index() > activeAnchor.index()){
        oldActiveSection.addClass("fadeOutDown");
        activeSection.addClass("fadeInDown");
      }else if(oldActiveAnchor.index() < activeAnchor.index()){
        oldActiveSection.addClass("fadeOutUp");
        activeSection.addClass("fadeInUp");
      }
      activeSection.addClass("animated");
      oldActiveSection.addClass("animated");
      console.log(oldActiveSection);
      oldActiveSection.one("webkitAnimationEnd mozAnimationEnd msAnimationEnd oAnimationEnd animationEnd",function(){
        $(this).removeClass("fadeInUp fadeInDown fadeOutUp fadeOutDown animated active").hide();
        $(this).css("width","auto");
      });
      activeSection.one("webkitAnimationEnd mozAnimationEnd msAnimationEnd oAnimationEnd animationEnd",function(){
        $(this).removeClass("fadeInUp fadeInDown fadeOutUp fadeOutDown animated").show();
        // $("html,body").css("overflow","auto");
        $(this).css("width","auto");
      });
    }
  }
});
function createPlaylistHTML(target, title, description, imgURL){
  if($(target).hasClass("playlist-list")){
    $(target).append(`
    <div class="playlist">
      <img class="playlist-thumbnail" src="`+imgURL+`" alt="`+title+`">
      <div class="playlist-info-container">
        <h3 class="playlist-heading">`+title+`</h3>
        <p class="playlist-description">`+description+`</p>
      </div>
      <button class="playlist-button"><i class="material-icons">file_copy</i></button>
      <button class="playlist-button"><i class="material-icons">call_merge</i></button>
      <button class="playlist-button"><i class="material-icons">call_split</i></button>
      <button class="playlist-button"><i class="material-icons">delete_outline</i></button>
    </div>`);
  }else{
    $(target).append(`
    <div class="playlist">
      <img class="playlist-thumbnail" src="`+imgURL+`" alt="`+title+`">
      <div class="playlist-info-container">
        <h3 class="playlist-heading">`+title+`</h3>
        <p class="playlist-description">`+description+`</p>
      </div>
    </div>`);
  }
}
function onAuth(){
  const playlistListHTML = '';
  $("#playlist-a").click(function(){
    let request = gapi.client.youtube.playlists.list({
      part: "snippet",
      mine: true,
      maxResults: 50
    });
    request.execute(function(response) {
      if(response.result){
        $("#manage-playlists-list").html("");
        response.result.items.forEach(function(i){
          createPlaylistHTML("#manage-playlists-list", i.snippet.title, i.snippet.description, i.snippet.thumbnails.default.url);
        });
      } else {
        console.error("failed to retrieve playlist data");
      }
    });
  });
  // $("a.nav.active").trigger("click");
}

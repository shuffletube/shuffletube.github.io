$(function(){

  //Import Saved Theme
  if(localStorage.theme == "light"){
    lightTheme();
  }

  //Authentication Skip Shortcut
  $(document).keydown(function(e){
    if(e.which == 27){
      $("#authorization-overlay").hide();
    }
  });

  //Margin Offset Nav
  function initTimeout(){
    activeBackground(true);
    $("main").css("margin-left",$("header").width()+"px");
  }

  //Run after fonts/icons are done loading
  initTimeout();
  setTimeout(initTimeout,500);
  $(window).resize(function(){
    initTimeout();
  });
  //Switch Active Sections
  var oldActiveAnchor = 0;
  $("a.nav").click(function(){
    if(!$(this).is("a.nav.active")){
      oldActiveAnchor = $("a.nav").eq($("a.nav.active").first().index());
      $("a.nav.active").removeClass("active");
      $(this).addClass("active");
      $("html, body").animate({scrollTop:0}, "slow");
      activeBackground();
    }
  });
  //Animates anchor background and switch between sections
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

  //Toggle Dark Theme On and Off
  $("#dark-theme-button").click(darkTheme);
  $("#light-theme-button").click(lightTheme);

  function darkTheme(){
    localStorage.theme = "dark";
    $("#color-theme-button-container button.active").removeClass("active");
    $("#dark-theme-button").addClass("active");
    if($("#light-theme-stylesheet").length){
      $("#light-theme-stylesheet").remove();
    }
  }
  function lightTheme(){
    localStorage.theme = "light";
    if($("#light-theme-stylesheet").length < 1){
      $("#color-theme-button-container button.active").removeClass("active");
      $("#light-theme-button").addClass("active");
      $("#light-theme-stylesheet").remove();
      $('<link rel="stylesheet" href="light-theme.css" id="light-theme-stylesheet">').appendTo("head");
    }
  }
});
//Inserts HTML for playlist
function createPlaylistHTML(target, playlistItems){
  console.log("playlist items:"+JSON.stringify(playlistItems));
  playlistItems.forEach(function(i){
    if($(target).hasClass("playlist-list")){
      $(target).append(`
      <div class="playlist" data-playlist-id="`+i.id+`">
        <img class="playlist-thumbnail" src="`+i.snippet.thumbnails.default.url+`" alt="`+i.snippet.title+`">
        <div class="playlist-info-container">
          <h3 class="playlist-heading">`+i.snippet.title+`</h3>
          <p class="playlist-description">`+i.snippet.description+`</p>
        </div>
        <button class="playlist-button"><i class="material-icons">file_copy</i></button>
        <button class="playlist-button"><i class="material-icons">call_merge</i></button>
        <button class="playlist-button"><i class="material-icons">delete_outline</i></button>
      </div>`);
    }else{
      $(target).append(`
      <div class="playlist">
        <img class="playlist-thumbnail" src="`+i.snippet.thumbnails.default.url+`" alt="`+i.snippet.title+`">
        <div class="playlist-info-container">
          <h3 class="playlist-heading">`+i.snippet.title+`</h3>
          <p class="playlist-description">`+i.snippet.description+`</p>
        </div>
      </div>`);
    }
  });
}
function createVideoListHTML(target, videoList){
  videoList.forEach(function(i){
    $(target).append(`
    <div class="video">
      <img class="video-thumbnail" src="`+(i.snippet.hasOwnProperty("thumbnails")?i.snippet.thumbnails.default.url:"shuffletubeloading.png")+`" alt="playlist">
      <div class="video-discription-container">
        <h3 class="video-title">`+i.snippet.title+`</h3>
        <!--<p class="video-artist"></p>-->
      </div>
      <p class="video-duration"></p>
    </div>`);
  });
}
var videoIndex = 0;
var player;
function nextVideoInPlaylist(response, shuffledItems){
  $("#video-list-container .video-list").removeClass("active");
  $("#video-list-container .video-list").eq(videoIndex).addClass("active");
  if($("#loading-video").is("img")){
    player = new YT.Player('loading-video', {
      height: '390',
      width: '640',
      videoId: shuffledItems[videoIndex].snippet.resourceId.videoId,
      events: {
        'onReady': function(e){e.target.playVideo();},
        'onStateChange': function(e){
          if(e.data == YT.PlayerState.ENDED){
            videoIndex++;
            if(videoIndex >= shuffledItems.length){
              videoIndex=0;
            }
            nextVideoInPlaylist(response, shuffledItems);
          }
        }
      }
    });
  } else {
    player.loadVideoById(shuffledItems[videoIndex].snippet.resourceId.videoId, 0);
  }
}
//Executes when user is logged in
function onAuth(){
  //Display Playlists List
  const playlistListHTML = '';
  $("#playlist-a").one("click",function(){
    let request = gapi.client.youtube.playlists.list({
      part: "snippet",
      mine: true,
      maxResults: 50
    });
    request.execute(function(response) {
      if(response.result){
        $("#manage-playlists-list").empty();
        createPlaylistHTML("#manage-playlists-list", response.result.items);
        //Load videos
        $("#manage-playlists-list .playlist").each(function(){
          let $this = $(this);
          $this.click(function(){
            let requestVideo = gapi.client.youtube.playlistItems.list({
              part: "snippet",
              playlistId: $this.attr("data-playlist-id"),
              maxResults: 50
            });
            requestVideo.execute(function(response) {
              if(response.result){
                $("#video-list-container").empty();
                // $("#video-list-container").find(".video-thumbnail").remove();
                let shuffledItems = response.result.items.slice(0);
                console.log("total resutls: "+response.result.pageInfo.totalResults);
                for(i = 1; i < response.result.pageInfo.totalResults; i++){
                  let requestMoreVideo = gapi.client.youtube.playlistItems.list({
                    part: "snippet",
                    playlistId: $this.attr("data-playlist-id"),
                    maxResults: 50,
                    pageToken: response.result.nextPageToken
                  });
                  requestMoreVideo.execute(function(anotherResponse){
                    shuffledItems = shuffledItems.concat(anotherResponse.result.items.slice(0));
                  });
                  //
                }

                shuffledItems = shuffledItems.filter(i => (typeof i !== undefined));

                //Randomize
                for (i = shuffledItems.length - 1; i > 0; i--) {
                  let j = Math.floor(Math.random() * (i + 1));
                  [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
                }
                console.log("Shuffled Items: "+JSON.stringify(shuffledItems));
                createVideoListHTML("#video-list-container", shuffledItems);
                nextVideoInPlaylist(response, shuffledItems);

              } else {
                console.error("failed to retrieve playlist video data");
              }
            });
          });
        });
      } else {
        console.error("failed to retrieve playlist data");
      }
    });
  });
}

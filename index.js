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
  activeBackground();
  $("a.nav").click(function(){
    $("a.nav.active").removeClass("active");
    $(this).addClass("active");
    activeBackground();
  });
  function activeBackground(){
    let activeAnchor = $("a.nav.active").first();
    $("#active-background").animate({top:activeAnchor.offset().top-$(window).scrollTop(), left:activeAnchor.offset().left-$(window).scrollLeft()},250);
    $("#active-background").prependTo(activeAnchor);
    $("#active-background").width(activeAnchor.outerWidth());
    $("#active-background").height(activeAnchor.outerHeight());
    $(".section").hide();
    $(activeAnchor.attr("data-section")).show();
  }
});
function onAuth(){

}

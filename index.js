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
  //
  activeBackground(true);
  setTimeout(function(){activeBackground(true);},200);

  let oldActiveAnchor;
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
      $(activeAnchor.attr("data-section")).show();
    } else{
      console.log(oldActiveAnchor);
      $(oldActiveAnchor.attr("data-section")).hide(0,function(){
          // alert("complete");
          // $(oldActiveAnchor.attr("data-section")).hide();
          // $(activeAnchor.attr("data-section")).show();
          $(oldActiveAnchor.attr("data-section")).hide();
          $(activeAnchor.attr("data-section")).show();
          $(activeAnchor.attr("data-section")).removeClass("fadeInDown animated");
          $(activeAnchor.attr("data-section")).addClass("fadeInDown animated");
      });
    }
  }
});
function onAuth(){

}

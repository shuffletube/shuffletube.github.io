 function createPlaylistHTML(target, playlistItems){
   // console.log("playlist items:"+JSON.stringify(playlistItems));
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
                 // console.log("total resutls: "+response.result.pageInfo.totalResults);
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
                 // console.log("Shuffled Items: "+JSON.stringify(shuffledItems));
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

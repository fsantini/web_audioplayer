<!DOCTYPE html>
<html>
<head>
  <title>Audiobook Player</title>
  <script>
    var playlist = [];
    // catch php error
    window.onerror = function(e) {
        console.log(e.message);
        console.log('Probably PHP is not working');
        playlist = ['Materassi01.mp3', 'Materassi02.mp3', 'Guida Galattica 01.mp3', 'Guida Galattica 02.mp3', 'Guida Galattica 03.mp3'];
    }
   </script>
   <script>
    // this only works with PHP. If tested locally, the previous tag is executed
    playlist = [
        <?php
        $dir = 'audio';
        $files = scandir($dir);
        sort($files);
        foreach ($files as $file) {
            if (substr($file, -4) == '.mp3') {
                echo "'$file',";
            }
        }
        ?>
    ];
  </script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
  <script src="web_audioplayer.js"></script>
  <link rel="stylesheet" href="web_audioplayer.css" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <h1>Lorenzo's Audiobook Player</h1>
  <div class="audioSelectDiv">
  Libro:&nbsp; 
    <select id="audioSelectBook">
    </select>
  </div>
  <div class="audioSelectDiv">
  Traccia:&nbsp; 
    <select id="audioSelectTrack">
    </select>
  </div>

  <div id="audioPlayerContainer">
    <audio id="audioPlayer"></audio>
    <div id="controlsDiv">
      <hr/>
      <div id="progressBar">
        <div id="progressBarFill"></div>
        <div id="timeDisplay">0:00 / 0:00</div>
      </div>
      <img src="icons/prev.png" id="prevButton">
      <img src="icons/replay.png" id="replayButton">
      <img src="icons/play.png" id="playButton">
      <img src="icons/pause.png" id="pauseButton">
      <img src="icons/forward10.png" id="forwardButton">
      <img src="icons/next.png" id="nextButton">
    </div>
  </div>
   
  <div id="credits">
    <p>Icons by <a href="https://icons8.com/">icons8</a></p>
  </div>
</body>
</html>

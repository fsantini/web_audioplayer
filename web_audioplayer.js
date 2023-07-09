var currentSong = null;
var currentPlayTimes = {};
var currentTrackInBooks = {};
var audioPlayer = null;
var currentBook = null;
var currentTrack = null;
const base_url = 'audio/'

function splitSong(song)
{
    const regex = /[0-9]+\.[^.]*$/;
    const track = song.match(regex)[0];
    const book = song.replace(track, '');
    return [book, track];
}

function playSong(song)
{
    console.log("Playing " + song);
    const [book, track] = splitSong(song);
    console.log("Book: " + book + ", Track: " + track);

    currentTrackInBooks[book] = track;
    localStorage.setItem('currentTrackInBooks', JSON.stringify(currentTrackInBooks));

    audioPlayer.src = base_url + song;
    if (song in currentPlayTimes) {
        audioPlayer.currentTime = currentPlayTimes[song];
        console.log("Restoring position: " + currentPlayTimes[song]);
    }
    localStorage.setItem('currentSong', song);
    currentSong = song;
    audioPlayer.play();
}

// Format the time in minutes and seconds
function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

function audio_time_update()
{
    var progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    $("#progressBarFill").width(progress + "%");
    var currentTime = formatTime(audioPlayer.currentTime);
    var duration = formatTime(audioPlayer.duration);
    $("#timeDisplay").html(currentTime + " / " + duration);
    currentPlayTimes[currentSong] = audioPlayer.currentTime;
    console.log("Current position: " + audioPlayer.currentTime);
    localStorage.setItem('currentPositions', JSON.stringify(currentPlayTimes));
}

function set_song_in_combobox(song) 
{
    var [book, track] = splitSong(song);
    $("#audioSelectBook").val(book);
    populate_combobox_track(book);
    $("#audioSelectTrack").val(track);
}


function select_change_book()
{
    var selectedBook = $("#audioSelectBook").val();
    populate_combobox_track(selectedBook);
    if (selectedBook in currentTrackInBooks)
    {
        const track = currentTrackInBooks[selectedBook];
        $("#audioSelectTrack").val(track);
        playSong(selectedBook + track);
        return;
    }
    const track = $("#audioSelectTrack").val();
    playSong(selectedBook + track);
}

function select_change_track()
{
    var selectedBook = $("#audioSelectBook").val();
    var selectedTrack = $("#audioSelectTrack").val();
    playSong(selectedBook + selectedTrack);
}

function populate_combobox_track(book)
{
    // Get the select element
    var select = $("#audioSelectTrack");
    // Remove all the options
    select.empty();
    // Add an option for each song
    for (var i = 0; i < playlist.length; i++)
    {
        var [book2, track] = splitSong(playlist[i]);
        if (book2 == book)
        {
            var option = $("<option></option>");
            option.attr("value", track);
            option.text(track);
            select.append(option);
        }
    }
}

function populate_combobox_books()
{
    // Get the select element
    var select = $("#audioSelectBook");
    // Remove all the options
    select.empty();
    // Add an option for each song
    var addedBooks = []
    for (var i = 0; i < playlist.length; i++)
    {
        var [book, track] = splitSong(playlist[i]);
        if (!addedBooks.includes(book))
        {
            addedBooks.push(book);
            var option = $("<option></option>");
            option.attr("value", book);
            option.text(book);
            select.append(option);
        }
    }
}

function play_next()
{
    // Get the index of the current song in the playlist
    var currentIndex = playlist.indexOf(currentSong);
    // Move to the next song in the playlist
    currentIndex = (currentIndex + 1) % playlist.length;
    // Get the next song
    var nextSong = playlist[currentIndex];
    console.log("Next song: " + nextSong);
    // Play the next song
    playSong(nextSong);
    set_song_in_combobox(nextSong);
}

function play_prev()
{
    console.log("Previous button clicked");
    if (audioPlayer.currentTime > 3)
    {
        // go to the start of the current song
        audioPlayer.currentTime = 0;
        return;
    }
    // go to the previous song
    // Get the index of the current song in the playlist
    var currentIndex = playlist.indexOf(currentSong);
    // Move to the next song in the playlist
    currentIndex -= 1;
    if (currentIndex < 0)
    {
        currentIndex += playlist.length;
    }
    console.log("Current index: " + currentIndex);
    // Get the next song
    var prevSong = playlist[currentIndex];
    console.log("Previous song: " + prevSong);
    // Play the next song
    playSong(prevSong);
    set_song_in_combobox(prevSong);
}

function replay10()
{
    time = audioPlayer.currentTime;
    if (time < 10)
    {
        audioPlayer.currentTime = 0;
    }
    else
    {
        audioPlayer.currentTime = time - 10;
    }
}

function forward10()
{
    time = audioPlayer.currentTime;
    if (time + 10 > audioPlayer.duration)
    {
        audioPlayer.currentTime = audioPlayer.duration;
    }
    else
    {
        audioPlayer.currentTime = time + 10;
    }
}

function seek(event)
{
    console.log("Seeking", event);
    console.log("OffsetX: " + event.offsetX
        + ", Outer width: " + $("#progressBar").outerWidth());
    var progress = event.offsetX / $("#progressBar").outerWidth();
    console.log("Progress: " + progress)
    audioPlayer.currentTime = audioPlayer.duration * progress;
}

$(document).ready(function() {
    populate_combobox_books();
    $("#pauseButton").hide();

    audioPlayer = $("#audioPlayer")[0];
    audioPlayer.volume = 1;
    let storedPlayTimes = localStorage.getItem('currentPositions');
    if (storedPlayTimes) {
        currentPlayTimes = JSON.parse(storedPlayTimes);
    }
    let storedTrackInBooks = localStorage.getItem('currentTrackInBooks');
    if (storedTrackInBooks) {
        currentTrackInBooks = JSON.parse(storedTrackInBooks);
    }
    // Restore the current position from localStorage, if available
    let currentSong = localStorage.getItem('currentSong');
    console.log("Current song: " + currentSong);
    console.log("playlist: " + playlist);
    if (currentSong && playlist.includes(currentSong))
    {
        set_song_in_combobox(currentSong);
        playSong(currentSong);
    } else
    {
        playSong(playlist[0]);
    }
    $("#audioSelectBook").change(select_change_book);
    $("#audioSelectTrack").change(select_change_track);
    $(audioPlayer)
        .on("ended", function() {
        currentPlayTimes[currentSong] = 0;
        localStorage.setItem('currentPositions', JSON.stringify(currentPlayTimes));
        play_next();
        })
        .on("timeupdate", audio_time_update)
        .on("pause", function() {
            $("#playButton").show();
            $("#pauseButton").hide();
        })
        .on("play", function() {
            $("#pauseButton").show();
            $("#playButton").hide();
        });

    $("#prevButton").click(play_prev);
    $("#nextButton").click(play_next);
    $("#replayButton").click(replay10);
    $("#playButton").click(function () { audioPlayer.play(); });
    $("#pauseButton").click(function () {audioPlayer.pause(); });

    $("#progressBar")
        .on("click", seek)
        .on("mousemove", function(event) {
            if (event.buttons == 1)
            {
                seek(event);
            }
        });
    
    $("#forwardButton").click(forward10);

});
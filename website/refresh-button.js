var loader = document.getElementsByClassName("loader");
var icon = document.getElementsByClassName("refresh-icon-wrapper");
var button = document.getElementsByClassName("map-button");

button[0].addEventListener("click", function () {
    if (icon[0].style.display == "none") {
        return;
    }

    SetLoadingIcon(true);
    setTimeout(() => {
        Collect();
      }, 1000);
});

function SetLoadingIcon(loading) {
   if (loading) {
    icon[0].style.display = "none";
    loader[0].style.display = "inline-block";
   } else {
    icon[0].style.display = "inline-block";
    loader[0].style.display = "none";
   }
}
$(document).ready(function() {
  var section_titles = [
    $("#todo_section"),
    $("#all_section"),
    $("#done_section")
  ];

  function section_clicked() {
    var current_title = $(this);
    section_titles.forEach(function(section_title) {
      // remove the CSS active of clicked section title
      // TODO
      // Check why use current_title === current_title get false??
      // probably, current_title is not the origin section_tilte,
      // because current_title.addClass or removeClass was not working.
      if (current_title[0] == section_title[0]) {
        // if comparison from
        // Ref: https://stackoverflow.com/questions/2407825/how-to-compare-two-elements-in-jquery
        console.log("current title", section_title[0], current_title);
        section_title.addClass("selected");
      } else {
        console.log("not curent title", section_title[0], current_title);
        section_title.removeClass("selected");
      }
      // add active to the clicked section title
    });
  }

  section_titles.forEach(function(section_title) {
    section_title.click(section_clicked);
    console.log(section_title);
    if (section_title === section_titles[0]) {
      console.log("EQ");
    }
  });
});

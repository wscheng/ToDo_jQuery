$(document).ready(function() {
  var TODO_ID = 0;
  var ALL_ID = 1;
  var DONE_ID = 2;
  var TODO_SHEET_KEYS = [TODO_ID, ALL_ID, DONE_ID];
  class ToDoSheet {
    constructor(section_title, sheet_body) {
      this.section_title = section_title;
      this.sheet_body = sheet_body;
    }
  }
  var toDoSheetMap = {};
  toDoSheetMap[TODO_ID] = new ToDoSheet($("#todo_section"), $("#todo-items"));
  toDoSheetMap[ALL_ID] = new ToDoSheet($("#all_section"), $("#all-items"));
  toDoSheetMap[DONE_ID] = new ToDoSheet($("#done_section"), $("#done-items"));

  var current_todo_id = TODO_ID;
  function section_clicked() {
    var clicked_title = $(this);
    var prev_todo_id = current_todo_id;

    TODO_SHEET_KEYS.forEach(function(section_key) {
      // remove the CSS active of clicked section title
      // TODO
      // Check why use current_title === current_title get false??
      // probably, current_title is not the origin section_tilte,
      // because current_title.addClass or removeClass was not working.
      if (clicked_title[0] == toDoSheetMap[section_key].section_title[0]) {
        // if comparison from
        // Ref: https://stackoverflow.com/questions/2407825/how-to-compare-two-elements-in-jquery
        console.log("current title", clicked_title);
        current_todo_id = section_key;
      }
      // add active to the clicked section title
    });
    if (current_todo_id == prev_todo_id) {
      // do nothing if clicking the same section
      return;
    } else {
      console.log(
        "click another section prev=",
        prev_todo_id,
        ", current=",
        current_todo_id
      );
      toDoSheetMap[prev_todo_id].section_title.removeClass("selected");
      toDoSheetMap[current_todo_id].section_title.addClass("selected");
      // fade out the previous sheet
      toDoSheetMap[prev_todo_id].sheet_body.removeClass("selected");
      toDoSheetMap[prev_todo_id].sheet_body.hide(200, function() {
        toDoSheetMap[current_todo_id].sheet_body.addClass("selected");
        toDoSheetMap[current_todo_id].sheet_body.show("slow");
      });
    }
  }

  console.log(toDoSheetMap);
  console.log(TODO_SHEET_KEYS);
  TODO_SHEET_KEYS.forEach(function(section_key) {
    toDoSheetMap[section_key].section_title.click(section_clicked);
    if (section_key == TODO_ID) {
      toDoSheetMap[section_key].sheet_body.show(200);
    }
  });

  // Enter user name
  $("#title-btn").click(function() {
    var text = $("#title-input").val();

    console.log(text);

    if (text.length !== 0) {
      $("#username_title").text(text + "'s ToDo List");
      $("#title-input").val("");
      $(".light-box").slideUp(500);
    } else {
      alert("Please enter your name, thanks!");
      $("#title-input").focus();
      return false;
    }
  });
  // when trash icon clicked
  // when todo item info updated
  // when a done item set not done, move to todo

  // when a new todo item added
  // sort order
  // 1.undone
  // 2.last updated
  //
});

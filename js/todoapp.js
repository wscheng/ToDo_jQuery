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
      // stop all the animation in previous section
      $(".todo-content").removeClass("do-strikethrough");
      $(".todo-content").removeClass("remove-strikethrough");
      $(".todo-checkbox").off("animationend");
      $(".todo-checkbox").prop("disabled", false);
      // change section title
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

  TODO_SHEET_KEYS.forEach(function(section_key) {
    toDoSheetMap[section_key].section_title.click(section_clicked);
    if (section_key == TODO_ID) {
      toDoSheetMap[section_key].sheet_body.show(200);
    }
  });

  // Enter user name
  $("#title-btn").click(function() {
    var username = $("#title-input").val();

    console.log(username);

    if (username.length !== 0) {
      $("#username_title").text(username + "'s ToDo List");
      $("#title-input").val("");
      $(".light-box").slideUp(500);
    } else {
      alert("Please enter your name, thanks!");
      $("#title-input").focus();
      return false;
    }
  });
  class ToDoItem {
    constructor(todo_content, update_time, is_done) {
      this.todo_content = todo_content;
      this.update_time = update_time;
      this.is_done = is_done;
    }
  }
  // when trash icon clicked
  // when todo item info updated
  // when a done item set not done, move to todo

  // when a new todo item added
  // sort order
  // 1.undone
  // 2.last updated
  //
  function formatDateTime(date) {
    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    M = M < 10 ? "0" + M : M;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var m = date.getMinutes();
    m = m < 10 ? "0" + m : m;
    var s = date.getSeconds();
    s = s < 10 ? "0" + s : s;
    var ms = date.getMilliseconds();
    if (ms < 10) {
      ms = "00" + ms;
    } else if (ms < 100) {
      ms = "0" + ms;
    }
    return parseInt(y + M + d + h + m + s + ms);
  }
  todoArr = [
    new ToDoItem(
      "Eat breakfast",
      formatDateTime(new Date(2000, 0, 1, 0, 0, 1, 0)),
      false
    ),
    new ToDoItem(
      "Write today's plan",
      formatDateTime(new Date(2000, 0, 1, 0, 0, 2, 0)),
      false
    )
  ];

  function get_new_todo_item_html_div(todoItem, hide_when_add) {
    todo_item_div =
      '<div class="row no-gutters todo-item text-left ongoing" id="' +
      todoItem.update_time +
      (hide_when_add ? '" style="display: none;' : "") +
      '"> \
  <div class="col-1"> \
  <input type="checkbox" class="todo-checkbox" /> \
  </div> \
  <div class="col-10" contenteditable="true">' +
      todoItem.todo_content +
      '</div> \
  <div class="col-1"> \
    <img class="todo-delete" src="img/trash_can.svg" /> \
  </div> \
  <div class="clearfix d-none d-sm-block"></div>\
</div>';
    return todo_item_div;
  }

  function addToDoItemToUI(todo_content) {
    if (todo_content.length != 0) {
      todoItem = new ToDoItem(todo_content, formatDateTime(new Date()), false);
      console.log(
        Object.getOwnPropertyNames(todoItem),
        formatDateTime(new Date()),
        todo_content
      );
      todoArr.push(todoItem);
      // if todo section now
      switch (current_todo_id) {
        case TODO_ID:
          $("#todo-items").prepend(get_new_todo_item_html_div(todoItem, true));
          $("#" + todoItem.update_time).show("slow");
          $("#all-items").prepend(get_new_todo_item_html_div(todoItem, false));
          break;
        case ALL_ID:
          $("#all-items").prepend(get_new_todo_item_html_div(todoItem, true));
          $("#" + todoItem.update_time).show("slow");
          $("#todo-items").prepend(get_new_todo_item_html_div(todoItem, false));
          break;
      }

      $("#todo-input").val("");
      return true;
    } else {
      alert("Please enter todo item, thanks!");
      $("#todo-input").focus();
      return false;
    }
  }

  // add new todo item
  $("#add-todo").click(function() {
    var todo_content = $("#todo-input").val();
    addToDoItemToUI(todo_content);
  });

  var ENTER_KEY_CODE = 13;
  $("#todo-input").keydown(function(e) {
    if (e.keyCode == ENTER_KEY_CODE) {
      var todo_content = $("#todo-input").val();
      return addToDoItemToUI(todo_content);
    }
  });
  // ToDo item done
  $(document).on("click", ".todo-checkbox", function() {
    var todo_item_checkbox = $(this);
    console.log("checked=", todo_item_checkbox.is(":checked"));

    // todo_item_checkbox.on("click", function(event) {
    //   event.event.preventDefault();
    // });
    var todo_item_id = $(this)
      .parent()
      .parent()
      .attr("id");
    var todoItemText = $(this)
      .parent()
      .next();

    todo_item_checkbox.prop("disabled", true);
    if (todoItemText.attr("class").indexOf("done") >= 0) {
      todoItemText.removeClass("done");
      todoItemText.addClass("remove-strikethrough");
      todoItemText.bind("animationend", function(e) {
        todoItemText.off("animationend");
        todoItemText.removeClass("remove-strikethrough");
        todo_item_checkbox.prop("disabled", false);
      });
    } else {
      todoItemText.removeClass("remove-strikethrough");
      todoItemText.addClass("done");
      todoItemText.addClass("do-strikethrough");
      todoItemText.on("animationend", function(e) {
        // console.log("animation name=", e.originalEvent.animationName);
        todoItemText.off("animationend");
        todoItemText.removeClass("do-strikethrough");
        todo_item_checkbox.prop("disabled", false);
      });
    }
    //todo_item_checkbox.on("click", todo_checkbox_onclick);
  });
  // Initialize demo TODO items
});

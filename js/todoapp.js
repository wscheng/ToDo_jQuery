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
      // stop all the animation in previous section
      // if animation still running, those animationend callback will not
      // be fired; thus, we have to do the callback here
      if ($(".todo-content.do-strikethrough").length) {
        switch (prev_todo_id) {
          case TODO_ID:
            $(".todo-content.do-strikethrough")
              .parent()
              .remove();
            break;
          case ALL_ID:
            var done_todo_item_id = $(".todo-content.do-strikethrough")
              .parent()
              .attr("id");
            $("#all-items #" + done_todo_item_id).remove();
            console.log(
              "objec get=",
              todoArr[done_todo_item_id],
              ",id=" + done_todo_item_id,
              ", arr=",
              todoArr
            );
            add_done_item_to_all_section(todoArr[done_todo_item_id], false);
            break;
        }
      }
      if ($(".todo-content.remove-strikethrough").length) {
        switch (prev_todo_id) {
          case ALL_ID:
            var ongoing_todo_item_id = $(".todo-content.remove-strikethrough")
              .parent()
              .attr("id");
            $("#all-items #" + ongoing_todo_item_id).remove();
            add_ongoing_item_to_all_section(
              todoArr[ongoing_todo_item_id],
              false
            );
            break;
          case DONE_ID:
            $(".todo-content.remove-strikethrough")
              .parent()
              .remove();
            break;
        }
      }
      // restore the checkbox to clickable while switching sections
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
    constructor(todo_content, init_time, is_done) {
      this.todo_content = todo_content;
      this.init_time = init_time;
      this.update_time = init_time;
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
  var todoArr = {};
  todoArr[formatDateTime(new Date(2000, 0, 1, 0, 0, 1, 0))] = new ToDoItem(
    "Eat breakfast",
    formatDateTime(new Date(2000, 0, 1, 0, 0, 1, 0)),
    false
  );
  todoArr[formatDateTime(new Date(2000, 0, 1, 0, 0, 2, 0))] = new ToDoItem(
    "Write today's plan",
    formatDateTime(new Date(2000, 0, 1, 0, 0, 2, 0)),
    false
  );

  function get_todo_item_html_div(todoItem, hide_when_add) {
    todo_item_div =
      '<div class="row no-gutters todo-item text-left ' +
      (todoItem.is_done ? "done" : "ongoing") +
      '" id="' +
      todoItem.init_time +
      (hide_when_add ? '" style="display: none;' : "") +
      '"> \
  <div class="col-1"> \
  <input type="checkbox" class="todo-checkbox" ' +
      (todoItem.is_done ? "checked" : "") +
      ' /> \
  </div> \
  <div class="col-10 todo-content" ' +
      (todoItem.is_done ? "" : 'contenteditable="true"') +
      ">" +
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
      todoArr[todoItem.init_time] = todoItem;
      // if todo section now
      switch (current_todo_id) {
        case TODO_ID:
          $("#todo-items").prepend(get_todo_item_html_div(todoItem, true));
          $("#" + todoItem.init_time).show("slow");
          $("#all-items").prepend(get_todo_item_html_div(todoItem, false));
          break;
        case ALL_ID:
          $("#all-items").prepend(get_todo_item_html_div(todoItem, true));
          $("#" + todoItem.init_time).show("slow");
          $("#todo-items").prepend(get_todo_item_html_div(todoItem, false));
          break;
        case DONE_ID:
          $("#all-items").prepend(get_todo_item_html_div(todoItem, false));
          $("#todo-items").prepend(get_todo_item_html_div(todoItem, false));
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
    console.log("id=", todo_item_id);
    var todoItemText = $(this)
      .parent()
      .next();
    var todoItemBar = $(this)
      .parent()
      .parent();

    // don't let user click the checkbox when arrangement of all
    // section is not done yet
    todo_item_checkbox.prop("disabled", true);

    if (todoItemBar.attr("class").indexOf("done") >= 0) {
      // the TODO item set to undone
      console.log(todoArr);
      var ongoing_todo_item = todoArr[todo_item_id];
      ongoing_todo_item.update_time = formatDateTime(new Date());
      ongoing_todo_item.is_done = false;

      todoItemBar.removeClass("done");
      todoItemBar.addClass("ongoing");
      todoItemText.addClass("remove-strikethrough");
      todoItemText.one("animationend", function(e) {
        todoItemText.removeClass("remove-strikethrough");
        switch (current_todo_id) {
          case TODO_ID:
            // should never happen
            break;
          case ALL_ID:
            todoItemBar.fadeOut(300, function() {
              todoItemBar.remove();
            });
            // move it to top
            add_ongoing_item_to_all_section(ongoing_todo_item, true);
            break;
          case DONE_ID:
            todoItemBar.fadeOut(300, function() {
              todoItemBar.remove(false);
            });
            break;
        }
      });
      if (current_todo_id == ALL_ID) {
        add_ongoing_item_to_todo_section(ongoing_todo_item);
        $("#done-items #" + ongoing_todo_item.init_time).remove();
      } else if (current_todo_id == DONE_ID) {
        add_ongoing_item_to_todo_section(ongoing_todo_item);
        $("#all-items #" + ongoing_todo_item.init_time).remove();
        add_ongoing_item_to_all_section(ongoing_todo_item, false);
      }
    } else {
      // the TODO item set to done
      var done_todo_item = todoArr[todo_item_id];
      done_todo_item.update_time = formatDateTime(new Date());
      done_todo_item.is_done = true;

      console.log("donetodo=", done_todo_item);
      todoItemText.removeClass("remove-strikethrough");
      todoItemBar.removeClass("ongoing");
      todoItemBar.addClass("done");
      todoItemText.addClass("do-strikethrough");
      todoItemText.one("animationend", function(e) {
        console.log("animation end");
        console.log("animation name=", e.originalEvent.animationName);
        todoItemText.removeClass("do-strikethrough");
        switch (current_todo_id) {
          case TODO_ID:
            todoItemBar.fadeOut(300, function() {
              todoItemBar.remove(false);
            });
            break;
          case ALL_ID:
            todoItemBar.fadeOut(300, function() {
              todoItemBar.remove();
            });
            // move it behind ongoing items
            add_done_item_to_all_section(done_todo_item, true);
            break;
          case DONE_ID:
            // should never happen
            break;
        }
      });

      if (current_todo_id == TODO_ID) {
        $("#all-items #" + done_todo_item.init_time).remove();
        add_done_item_to_all_section(done_todo_item, false);
      } else if (current_todo_id == ALL_ID) {
        $("#todo-items #" + done_todo_item.init_time).remove();
      }
      add_done_item_to_done_section(done_todo_item);
    }
  });
  function add_done_item_to_all_section(done_todo_item, need_animation) {
    if (need_animation) {
      // move to top of done items
      if ($("#all-items>div.ongoing").length > 0) {
        // 1.find the ongoing end
        $("#all-items>div.ongoing")
          .last()
          .after(get_todo_item_html_div(done_todo_item, true));
      } else if ($("#all-items>div.done".length > 0)) {
        // 2.if no ongoing items, find 1st done item
        $("#all-items>div.done")
          .first()
          .before(get_todo_item_html_div(done_todo_item, true));
      } else {
        // 3.if there is no ongoing, done items do nothing
        $("#all-items").append(get_todo_item_html_div(done_todo_item, true));
      }
      $("#all-items #" + done_todo_item.init_time).show("slow");
    } else {
      // move to top of done items
      if ($("#all-items>div.ongoing").length > 0) {
        // 1.find the ongoing end
        $("#all-items>div.ongoing")
          .last()
          .after(get_todo_item_html_div(done_todo_item, false));
      } else if ($("#all-items>div.done").length > 0) {
        // 2.if no ongoing items, find 1st done item
        $("#all-items>div.done")
          .first()
          .before(get_todo_item_html_div(done_todo_item, false));
      } else {
        // 3.if there is no ongoing, done items do nothing
        $("#all-items").append(get_todo_item_html_div(done_todo_item, false));
      }
    }
  }
  function add_done_item_to_done_section(done_todo_item) {
    $("#done-items").prepend(get_todo_item_html_div(done_todo_item, false));
  }
  function add_ongoing_item_to_all_section(ongoing_todo_item, need_animation) {
    if (need_animation) {
      $("#all-items").prepend(get_todo_item_html_div(ongoing_todo_item, true));
      $("#all-items #" + ongoing_todo_item.init_time).show("slow");
    } else {
      $("#all-items").prepend(get_todo_item_html_div(ongoing_todo_item, false));
    }
  }
  function add_ongoing_item_to_todo_section(ongoing_todo_item) {
    $("#todo-items").prepend(get_todo_item_html_div(ongoing_todo_item, false));
  }
  // Initialize demo TODO items
});

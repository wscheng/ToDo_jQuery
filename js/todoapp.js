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
  var todoArr = [
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
      todoArr.push(todoItem);
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
    var todoItemBar = $(this)
      .parent()
      .parent();

    // don't let user click the checkbox when arrangement of all
    // section is not done yet
    todo_item_checkbox.prop("disabled", true);

    if (todoItemBar.attr("class").indexOf("done") >= 0) {
      // the TODO item set to undone
      var ongoing_todo_item;
      todoArr.forEach(function(todo_item) {
        if (todo_item_id == todo_item.init_time) {
          todo_item.update_time = formatDateTime(new Date());
          todo_item.is_done = false;
          ongoing_todo_item = todo_item;
        }
      });
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
            add_ongoing_item_to_todo_section(ongoing_todo_item);
            todoItemBar.fadeOut(300, function() {
              todoItemBar.remove();
            });
            // move it to top
            add_done_item_to_all_section(done_todo_item, true);
            $("#done-items #" + ongoing_todo_item.init_time).remove();
            break;
          case DONE_ID:
            todoItemBar.fadeOut(300, function() {
              todoItemBar.remove(false);
            });
            $("#all-items #" + ongoing_todo_item.init_time).remove();
            add_ongoing_item_to_todo_section(ongoing_todo_item);
            add_ongoing_item_to_all_section(ongoing_todo_item, false);
            break;
        }
      });
    } else {
      // the TODO item set to done
      var done_todo_item;
      todoArr.forEach(function(todo_item) {
        if (todo_item_id == todo_item.init_time) {
          todo_item.update_time = formatDateTime(new Date());
          todo_item.is_done = true;
          done_todo_item = todo_item;
        }
      });
      console.log("donetodo=", done_todo_item);
      todoItemText.removeClass("remove-strikethrough");
      todoItemBar.removeClass("ongoing");
      todoItemBar.addClass("done");
      todoItemText.addClass("do-strikethrough");
      todoItemText.one("animationend", function(e) {
        // console.log("animation name=", e.originalEvent.animationName);
        todoItemText.removeClass("do-strikethrough");
        switch (current_todo_id) {
          case TODO_ID:
            todoItemBar.fadeOut(300, function() {
              todoItemBar.remove(false);
            });
            $("#all-items #" + done_todo_item.init_time).remove();
            add_done_item_to_all_section(done_todo_item, false);
            break;
          case ALL_ID:
            $("#todo-items #" + done_todo_item.init_time).remove();
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
      } else if ($("done".length > 0)) {
        // 2.if no ongoing items, find 1st done item
        $("#all-items>div.done")
          .first()
          .before(get_todo_item_html_div(done_todo_item, false));
      } else {
        // 3.if there is no ongoing, done items do nothing
        $("#all-items").append(get_todo_item_html_div(done_todo_item, false));
      }
      $("#all-items #" + done_todo_item.init_time).prop("checked", true);
    }
  }
  function add_done_item_to_done_section(done_todo_item) {
    $("#done-items").prepend(get_todo_item_html_div(done_todo_item, false));
  }
  function add_ongoing_item_to_all_section(ongoing_todo_item, need_animation) {
    if (need_animation) {
      $("#all-items").prepend(get_todo_item_html_div(ongoing_todo_item, true));
      $("#all-items #" + done_todo_item.init_time).show("slow");
    } else {
      $("#all-items").prepend(get_todo_item_html_div(ongoing_todo_item, false));
    }
  }
  function add_ongoing_item_to_todo_section(done_todo_item) {
    $("#todo-items").prepend(get_todo_item_html_div(done_todo_item, false));
  }
  // Initialize demo TODO items
});

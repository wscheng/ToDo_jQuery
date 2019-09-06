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
            var done_todo_item_id = get_todo_item_id_from_bar(
              $(".todo-content.do-strikethrough").parent()
            );
            update_done_item_in_all_section(todoArr[done_todo_item_id], false);
            break;
        }
      }
      if ($(".todo-content.remove-strikethrough").length) {
        switch (prev_todo_id) {
          case ALL_ID:
            var ongoing_todo_item_id = get_todo_item_id_from_bar(
              $(".todo-content.remove-strikethrough").parent()
            );
            update_ongoing_item_in_all_section(
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
        // auto scroll to top, while switching section
        toDoSheetMap[current_todo_id].sheet_body.scrollTop(0);
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

  // when trash icon clicked
  function get_todo_item_id_from_bar(todo_item_bar) {
    //if (todo_item_bar.length == 0) return;
    var id;
    todo_item_bar
      .attr("class")
      .split(" ")
      .forEach(function(class_name) {
        if (class_name.indexOf("id_") == 0) {
          id = class_name;
        }
      });
    return id;
  }
  $(document).on("click", ".todo-delete", function() {
    var todo_item_id = get_todo_item_id_from_bar(
      $(this)
        .parent()
        .parent()
    );
    console.log("id=", todo_item_id);
    var todo_item = todoArr[todo_item_id];
    var result = confirm('Delete "' + todo_item.todo_content + '"?');
    if (result) {
      console.log($("." + todo_item_id).length);
      $("." + todo_item_id).remove();
    }
  });

  // TODO when todo item info updated
  // move the items to the top
  // future work, we have to consider the situation that user change sections
  // when we're still moving items...
  var kept_orig_todo_content;
  $(document).on("focus", ".todo-content", function() {
    kept_orig_todo_content = $(this).html();
  });
  $(document).on("blur", ".todo-content", function() {
    var changed_content = $.trim($(this).html());
    // TODO now trim is not working, because the space will turn into nbsp;
    // if content is empty, restore to origin content
    if (changed_content === "") {
      $(this).html(kept_orig_todo_content);
      return;
    }
    var todo_item_id = get_todo_item_id_from_bar($(this).parent());
    todoArr[todo_item_id].todo_content = changed_content;
    $("div." + todo_item_id + ">div.todo-content").html(changed_content);
  });

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

  function get_todo_item_html_div(todoItem, hide_when_add) {
    todo_item_div =
      '<div class="row no-gutters todo-item text-left ' +
      (todoItem.is_done ? "done" : "ongoing") +
      " " +
      todoItem.id +
      '" ' +
      (hide_when_add ? ' style="display: none;"' : "") +
      '> \
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
      todoArr[todoItem.id] = todoItem;
      // if todo section now
      switch (current_todo_id) {
        case TODO_ID:
          $("#todo-items").prepend(get_todo_item_html_div(todoItem, true));
          $("." + todoItem.id).show("slow");
          $("#all-items").prepend(get_todo_item_html_div(todoItem, false));
          break;
        case ALL_ID:
          $("#all-items").prepend(get_todo_item_html_div(todoItem, true));
          $("." + todoItem.id).show("slow");
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

    var todoItemBar = $(this)
      .parent()
      .parent();
    var todo_item_id = get_todo_item_id_from_bar(todoItemBar);
    var todoItemText = $(this)
      .parent()
      .next();
    // don't let user click the checkbox when arrangement of all
    // section is not done yet
    todo_item_checkbox.prop("disabled", true);

    if (todoItemBar.attr("class").indexOf("done") >= 0) {
      // the TODO item set to undone
      console.log(todoArr);
      var ongoing_todo_item = todoArr[todo_item_id];
      ongoing_todo_item.update_time = formatDateTime(new Date());
      ongoing_todo_item.is_done = false;

      todoItemText.addClass("remove-strikethrough");
      if (current_todo_id == ALL_ID) {
        todoItemText.one("animationend", function(e) {
          todoItemText.removeClass("remove-strikethrough");

          update_ongoing_item_in_all_section(ongoing_todo_item, true);
        });
        $("#done-items ." + ongoing_todo_item.id).remove();
      } else if (current_todo_id == DONE_ID) {
        todoItemText.one("animationend", function(e) {
          todoItemText.removeClass("remove-strikethrough");
          todoItemBar.fadeOut(300, function() {
            todoItemBar.remove(false);
          });
        });
        update_ongoing_item_in_all_section(ongoing_todo_item, false);
      }
      add_ongoing_item_to_todo_section(ongoing_todo_item);
    } else {
      // the TODO item set to done
      var done_todo_item = todoArr[todo_item_id];
      done_todo_item.update_time = formatDateTime(new Date());
      done_todo_item.is_done = true;

      todoItemText.removeClass("remove-strikethrough");
      todoItemText.attr("contenteditable", "false");
      todoItemText.addClass("do-strikethrough");

      if (current_todo_id == TODO_ID) {
        todoItemText.one("animationend", function(e) {
          todoItemText.removeClass("do-strikethrough");
          todoItemBar.fadeOut(300, function() {
            todoItemBar.remove(false);
          });
        });
        update_done_item_in_all_section(done_todo_item, false);
      } else if (current_todo_id == ALL_ID) {
        todoItemText.one("animationend", function(e) {
          todoItemText.removeClass("do-strikethrough");
          update_done_item_in_all_section(done_todo_item, true);
        });
        $("#todo-items ." + done_todo_item.id).remove();
      }
      add_done_item_to_done_section(done_todo_item);
    }
  });

  // sort order
  // 1.undone
  // 2.last updated
  function update_done_item_in_all_section(done_todo_item, need_animation) {
    var orig_todo_item_bar = $("#all-items ." + done_todo_item.id);
    // don't move if the done item is at the last position, or
    if (
      get_todo_item_id_from_bar($("#all-items>div.ongoing").last()) ==
      done_todo_item.id
    ) {
      orig_todo_item_bar.replaceWith(
        get_todo_item_html_div(done_todo_item, false)
      );
      return;
    }
    if (need_animation) {
      // move it behind ongoing items
      // move to top of done items
      if ($("#all-items>div.ongoing").length > 1) {
        // 1.find the ongoing end
        orig_todo_item_bar.fadeOut(300, function() {
          orig_todo_item_bar.remove();
        });
        $("#all-items>div.ongoing")
          .last()
          .after(get_todo_item_html_div(done_todo_item, true));
        $("#all-items ." + done_todo_item.id).show("slow");
      } else if ($("#all-items>div.done").length > 0) {
        // 2.if no other ongoing items, find 1st done item
        orig_todo_item_bar.fadeOut(300, function() {
          orig_todo_item_bar.remove();
        });
        $("#all-items>div.done")
          .first()
          .before(get_todo_item_html_div(done_todo_item, true));
        $("#all-items ." + done_todo_item.id).show("slow");
      }
    } else {
      // move to top of done items
      if ($("#all-items>div.ongoing").length > 1) {
        // 1.find the ongoing end
        orig_todo_item_bar.remove();
        $("#all-items>div.ongoing")
          .last()
          .after(get_todo_item_html_div(done_todo_item, false));
      } else if ($("#all-items>div.done").length > 0) {
        // 2.if no ongoing items, find 1st done item
        orig_todo_item_bar.remove();
        $("#all-items>div.done")
          .first()
          .before(get_todo_item_html_div(done_todo_item, false));
      }
    }
  }

  function add_done_item_to_done_section(done_todo_item) {
    $("#done-items").prepend(get_todo_item_html_div(done_todo_item, false));
  }

  function update_ongoing_item_in_all_section(
    ongoing_todo_item,
    need_animation
  ) {
    var orig_todo_item_bar = $("#all-items ." + ongoing_todo_item.id);
    if (
      get_todo_item_id_from_bar($("#all-items>div").first()) ==
      ongoing_todo_item.id
    ) {
      orig_todo_item_bar.replaceWith(
        get_todo_item_html_div(ongoing_todo_item, false)
      );
      return;
    }
    if (need_animation) {
      orig_todo_item_bar.fadeOut(300, function() {
        orig_todo_item_bar.remove();
      });
      $("#all-items").prepend(get_todo_item_html_div(ongoing_todo_item, true));
      $("#all-items ." + ongoing_todo_item.id).show("slow");
    } else {
      orig_todo_item_bar.remove();
      $("#all-items").prepend(get_todo_item_html_div(ongoing_todo_item, false));
    }
  }

  function add_ongoing_item_to_todo_section(ongoing_todo_item) {
    $("#todo-items").prepend(get_todo_item_html_div(ongoing_todo_item, false));
  }

  function compareByInitTime(a, b) {
    if (a.iniit_time < b.iniit_time) {
      return -1;
    }
    if (a.iniit_time > b.iniit_time) {
      return 1;
    }
    return 0;
  }

  // [Class] ToDo Item
  class ToDoItem {
    constructor(todo_content, init_time, is_done) {
      this.id = "id_" + init_time;
      this.todo_content = todo_content;
      this.init_time = init_time;
      this.update_time = init_time;
      this.is_done = is_done;
    }
  }

  // Initialize demo TODO items
  var todoArr = {};
  function add_init_items(todo_item) {
    todoArr[todo_item.id] = todo_item;
  }
  add_init_items(
    new ToDoItem(
      "Eat breakfast",
      formatDateTime(new Date(2000, 0, 1, 0, 0, 1, 0)),
      false
    )
  );
  add_init_items(
    new ToDoItem(
      "Write today's plan",
      formatDateTime(new Date(2000, 0, 1, 0, 0, 2, 0)),
      false
    )
  );

  Object.keys(todoArr)
    .sort(compareByInitTime)
    .forEach(function(init_todo_item_id) {
      var init_todo_item = todoArr[init_todo_item_id];
      if (init_todo_item.is_done) {
        $("#all-items").append(get_todo_item_html_div(init_todo_item, false));
        $("#done-items").append(get_todo_item_html_div(init_todo_item, false));
      } else {
        $("#todo-items").append(get_todo_item_html_div(init_todo_item, false));
        $("#all-items").append(get_todo_item_html_div(init_todo_item, false));
      }
    });
});

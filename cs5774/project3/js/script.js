/* ============================================================
   SpotChecker — script.js
   Author: Jasmine Walker
   Project 3: Behavior and Interaction

   This single external script is linked from every page. It uses
   jQuery (loaded before this file) to add three behaviors:


   Each behavior is wrapped in a check so it only runs on the page
   that actually contains the elements it needs. Everything starts
   after the DOM is ready.

   SEARCH KEYPHRASE: "parking pass"
   ============================================================ */

$(function () {

  /* ----------------------------------------------------------
     1. SIMULATED SEARCH  (search.html)
     The search form (in every page header) submits with GET to
     search.html, so the typed phrase arrives in the URL as ?q=...
     Here we read it, and with an if/else decide whether to show
     simulated results or a friendly "no results" message.
     jQuery is used to read the query, build the result markup,
     and inject it into the page.
  ---------------------------------------------------------- */
  var $searchPage = $("#search-results");      // only exists on search.html
  if ($searchPage.length) {

    // The keyphrase that "matches" something in our simulated index.
    var KEYPHRASE = "parking pass";

    // Read the ?q= value out of the URL and tidy it up.
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();

    // Echo what the user searched for.
    $("#search-query").text(query ? '"' + query + '"' : "(nothing)");

    // Decide what to show. A simple case-insensitive match: if the
    // query contains our keyphrase, show results; otherwise show the
    // friendly error. (An if-statement, as the spec allows.)
    if (query.toLowerCase().indexOf(KEYPHRASE) !== -1) {

      // Simulated results — built as jQuery elements and appended.
      var results = [
        { title: "How to buy a parking pass",
          text: "Students and staff can purchase or renew a permit online through the Parking Services portal." },
        { title: "Parking pass types and prices",
          text: "Commuter, faculty/staff, and visitor permits are available at different rates for each semester." },
        { title: "Where your parking pass is valid",
          text: "Each pass lists the lots and garages it covers. Check a lot's detail page for its permit type." }
      ];

      $.each(results, function (i, r) {
        var $card = $("<article>").addClass("card search-result");
        $card.append($("<h3>").text(r.title));
        $card.append($("<p>").text(r.text));
        $searchPage.append($card);              // add new elements
      });

    } else {
      // Friendly error message when nothing matches.
      var $msg = $("<div>").addClass("card search-empty");
      $msg.append($("<h3>").text("No results found"));
      $msg.append($("<p>").text(
        "We couldn't find anything for your search. Try searching for \"parking pass\"."
      ));
      $searchPage.append($msg);
    }
  }


  /* ----------------------------------------------------------
     2. SAVE TO FAVORITES  (list.html)
     INTERACTION #1 — event type: click, uses EVENT DELEGATION.

     The Save buttons live inside the lot list. Instead of binding a
     handler to every button, we bind ONE handler to the list
     container (#all-lots) and let clicks on .save-btn bubble up to
     it. This is event delegation, and it would also work for lot
     rows added later.

     On click it (1) MODIFIES an existing element — the button turns
     into "Saved" and (2) ADDS a new element a <li> appended to
     the favorites list.
  ---------------------------------------------------------- */
  var $allLots = $("#all-lots");                // only exists on list.html
  if ($allLots.length) {

    $allLots.on("click", ".save-btn", function () {
      var $btn = $(this);

      // DOM traversal: from the clicked button up to its row, then
      // down into the row to read the lot's name.
      var $row = $btn.closest("li");
      var lotName = $row.find(".lot-name").text().trim();

      // Guard: don't add the same lot twice.
      if ($btn.hasClass("saved")) {
        return;
      }

      // (1) MODIFY the existing button.
      $btn.addClass("saved").text("✓ Saved");

      // (2) ADD a new <li> to the favorites list, and hide the
      //     "no favorites yet" message the first time.
      $("#fav-empty").hide();
      var $favItem = $("<li>").text(lotName);
      $("#fav-list").append($favItem);
    });
  }


  /* ----------------------------------------------------------
     3. REPORT FORM VALIDATION  (report.html)
     INTERACTION #2 — event type: submit, uses DOM TRAVERSAL.

     When the report form is submitted we validate the "open spaces"
     field with JavaScript (not the browser's built-in validation).
     If it's invalid we (1) MODIFY the existing field by turning it
     red and (2) ADD a new <p> error message next to it. If it's
     valid we show a success message instead. We always prevent the
     real submit because this prototype has no backend.
  ---------------------------------------------------------- */
  var $reportForm = $("#report-form");          // only exists on report.html
  if ($reportForm.length) {

    $reportForm.on("submit", function (event) {
      event.preventDefault();                   // no real server to post to

      var $spaces = $("#spaces");
      var value = $spaces.val().trim();

      // DOM traversal: find the field wrapper around the input so we
      // can place messages relative to it.
      var $field = $spaces.closest(".field");

      // Clear any messages/highlight from a previous attempt.
      $field.find(".error-msg").remove();
      $reportForm.find(".success-msg").remove();
      $spaces.removeClass("input-error");

      // Validate: must be a whole number between 0 and 500.
      var n = Number(value);
      var isValid = value !== "" &&
                    Number.isInteger(n) &&
                    n >= 0 && n <= 500;

      if (!isValid) {
        // (1) MODIFY the existing input — red border.
        $spaces.addClass("input-error");

        // (2) ADD a new error message element after the input.
        var $error = $("<p>")
          .addClass("error-msg")
          .text("Enter a whole number of open spaces between 0 and 500.");
        $field.append($error);

        $spaces.trigger("focus");
      } else {
        // Valid: show a success message (modify + add path).
        var $ok = $("<p>")
          .addClass("success-msg")
          .text("✓ Report submitted — thanks for helping other Hokies!");
        $reportForm.append($ok);
      }
    });
  }

});

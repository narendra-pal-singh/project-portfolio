STARTERAPP.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: BASE_URL + "/Views/dashboard/index",
    })
    // chatgpt
    .when("/chatgpt", {
      templateUrl: BASE_URL + "/chatgpt/form",
      controller: "chatController"
    })
    .when("/chatgpt/:req_id", {
      // templateUrl: BASE_URL + "/chatgpt/list_questions",
      templateUrl: function (params) {
        return BASE_URL + "/chatgpt/list_questions/" + params.req_id;
      },
      controller: "chatController"
    })
    .when("/questions", {
      templateUrl: BASE_URL + "/chatgpt/questions",
      controller: "chatController"
    })
    .when("/import-questions", {
      templateUrl: BASE_URL + "/chatgpt/import_qus_form",
      controller: "chatController"
    })
    .when("/import-images", {
      templateUrl: BASE_URL + "/chatgpt/import_image_form",
      controller: "chatController"
    })
    .when("/parent-practice-tests", {
      templateUrl: BASE_URL + "/chatgpt/assessments",
      controller: "chatController"
    })
    .when("/report-questions", {
      templateUrl: BASE_URL + "/chatgpt/report_questions",
      controller: "chatController"
    })
    .when("/chatgpt/subtopic", {
      templateUrl: BASE_URL + "/chatgpt/subtopic",
      controller: "chatController"
    }).when("/papers", {
      templateUrl: BASE_URL + "/chatgpt/paper_list",
      controller: "chatController"
    }).when("/paper-set", {
      templateUrl: BASE_URL + "/chatgpt/paper_set",
      controller: "chatController"
    }).when("/paper-set-edit/:id", {
      // templateUrl: BASE_URL + "/chatgpt/paper_set_edit",
      templateUrl: function (params) {
        return BASE_URL + "/chatgpt/paper_set_edit/" + params.id;
      },
      controller: "chatController"
    }).when("/paper-set-create", {
      templateUrl: BASE_URL + "/chatgpt/paper_set_create",
      controller: "chatController"
    }).when("/paper-edit/:id", {
      templateUrl: BASE_URL + "/chatgpt/paper_edit",
      controller: "chatController"
    }).when("/copy-paper/:id", {
      templateUrl: BASE_URL + "/Views/templates/paper_copy",
      controller: "chatController"
    }).when("/papers-test", {
      templateUrl: BASE_URL + "/chatgpt/paper_test_list",
      controller: "chatController"
    }).when("/papers-attempt", {
      templateUrl: BASE_URL + "/chatgpt/paper_attempt_list",
      controller: "chatController"
    }).when("/paper-result/:pid/:sid", {
      templateUrl: BASE_URL + "/chatgpt/paper_result",
      controller: "chatController"
    }).when("/paper-check-list", {
      templateUrl: BASE_URL + "/chatgpt/paper_check_list",
      controller: "chatController"
    }).when("/paper-check/:pid", {
      templateUrl: BASE_URL + "/chatgpt/paper_check",
      controller: "chatController"
    })
    .when("/check-paper/:pid/student/:sid", {
      templateUrl: BASE_URL + "/chatgpt/check_paper_student",
      controller: "chatController"
    })
    .when("/list-questions", {
      templateUrl: BASE_URL + "/chatgpt/list_questions",
      controller: "chatController"
    })


    //------------Parent Section----------------------
    .when("/parent_login", {
      templateUrl: 'ParentCtrl/parent_page',
      controller: 'parent'
    })
    .when("/parent_profile", {
      templateUrl: 'ParentCtrl/parent_profile',
      controller: 'parent'
    })
    .when("/create_student_profile", {
      templateUrl: 'ParentCtrl/create_student_profile',
      controller: 'parent'
    })

    .when("/parent-dashboard", {
      templateUrl: BASE_URL + "/Views/dashboard/parent_dashboard",
    })

    .when("/dashboard/:child_id", {
      templateUrl: function (params) { return 'ParentCtrl/view_student_dashboard/' + params.child_id; },
      controller: 'parent'
    })
    //---------------------------------------

    //   .when("/question", {
    //     templateUrl: BASE_URL + "/question/",
    //     controller: "quesController"
    // })

    // ##############################################

});
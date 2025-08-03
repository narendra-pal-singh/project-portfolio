STARTERAPP.controller("chatController", function ($rootScope, $scope, $sce, $http, $location, $routeParams, $timeout, $filter, $window, $interval, $compile) {
    console.log('chatController');
    $scope.access = {};
    $scope.redirectHome = () => {
        $location.path('/');
    }
    $scope.initPagination = (pageData) => {
        // console.log('pageData', pageData);
        if (pageData && pageData.total != undefined) {
            $scope.totalItems = parseInt(pageData.total);
            $scope.maxSize = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        } else {
            $scope.totalItems = 0;
        }
    }
    $scope.resetPaging = () => {
        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;
        $scope.maxSize = 0;
        $scope.totalItems = 0;
        $scope.pagingStart = 1;
        $scope.pagingEnd = 10;
    }
    $scope.resetPaging();
    $scope.nextQuestionsPage = (page) => {
        $scope.pagingStart = page > 5 ? page - 5 : 1;
        $scope.pagingEnd = $scope.pagingStart + 10;
        $scope.currentPage = page;
        $scope.get_questions_list();
    };
    $scope.chatForm = {
        topics: [],
        qus_num: [],
        subtopics: []
    };
    $scope.list_questions = (type = 0) => {
        post_data = angular.copy($scope.chatForm);
        console.log('post_data', post_data);
        if (!post_data.board_id) {
            swal("Warning!", "Please select board", "warning"); return false;
        } else if (!post_data.class_id) {
            swal("Warning!", "Please select class", "warning"); return false;
        } else if (!post_data.subject_id) {
            swal("Warning!", "Please select subject", "warning"); return false;
        } else if (!post_data.question_type) {
            if (!post_data.paper_bank_id) {
                swal("Warning!", "Please select question type", "warning"); return false;
            }
        }
        if (!post_data.paper_bank_id) {
            if (post_data.question_type) {
                var flag = 0;
                for (key in post_data.question_type) {
                    if (post_data.question_type[key] == true)
                        flag = 1;
                }
                if (flag == 0) {
                    swal("Warning!", "Please select question type", "warning"); return false;
                }
            }
            if (post_data.exam_type == "Subjective" && !post_data.subjective_type) {
                swal("Warning!", "Please select subjective type", "warning"); return false;
            }
            if (!post_data.difficulty_level) {
                swal("Warning!", "Please select difficulty level", "warning"); return false;
            } else {
                if (post_data.topics.length == 0) {
                    swal("Warning!", "Please enter at least one topic", "warning"); return false;
                } else {
                    for (var i = 0; i < post_data.topics.length; i++) {
                        if (post_data.topics[i]) {
                            if (!post_data.qus_num[i]) {
                                swal("Warning!", "Please enter topic question number of " + post_data.topics[i], "warning"); return false;
                            }
                        }
                    }
                }
            }
        }
        for (key in $rootScope.board_list) {
            if ($rootScope.board_list[key].board_id == $scope.chatForm.board) {
                post_data.board_name = $rootScope.board_list[key].board_name;
            }
        }
        // console.log('submit')
        $('.btn-danger').trigger('click');
        $http({
            url: BASE_URL + "/chatgpt/form",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param($scope.chatForm)
        }).then(function (response) {
            console.log('response', response)
            if (response.data.status && response.data.status == true) {
                // $rootScope.query_post = response.data.post_data;
                if (type == 0) {
                    $location.path('/chatgpt/' + response.data.form_req_Id);
                    //$location.path('/list-questions');
                } else if (type == 1) {
                    $scope.getPaperQuestion();
                }
            } else {
                swal("Error", response.data.msg, "error");
            }
            // $scope.submitDisabled = false;
        });
    }
    $scope.list_questions = (type = 0) => {
        const postData = angular.copy($scope.chatForm);
        console.log('post_data', postData);

        // Validation
        if (!postData.board_id) {
            swal("Warning!", "Please select board", "warning"); return;
        }
        if (!postData.class_id) {
            swal("Warning!", "Please select class", "warning"); return;
        }
        if (!postData.subject_id) {
            swal("Warning!", "Please select subject", "warning"); return;
        }
        if (!postData.question_type && !postData.paper_bank_id) {
            swal("Warning!", "Please select question type", "warning"); return;
        }

        if (!postData.paper_bank_id) {
            if (postData.question_type) {
                const hasQuestionType = Object.values(postData.question_type).some(val => val === true);
                if (!hasQuestionType) {
                    swal("Warning!", "Please select question type", "warning"); return;
                }
            }
            if (postData.exam_type === "Subjective" && !postData.subjective_type) {
                swal("Warning!", "Please select subjective type", "warning"); return;
            }
            if (!postData.difficulty_level) {
                swal("Warning!", "Please select difficulty level", "warning"); return;
            }
            if (postData.topics.length === 0) {
                swal("Warning!", "Please enter at least one topic", "warning"); return;
            }
            for (let i = 0; i < postData.topics.length; i++) {
                if (postData.topics[i] && !postData.qus_num[i]) {
                    swal("Warning!", `Please enter topic question number for ${postData.topics[i]}`, "warning");
                    return;
                }
            }
        }

        // Get board name from list
        const selectedBoard = $rootScope.board_list.find(
            board => board.board_id === $scope.chatForm.board
        );
        if (selectedBoard) {
            postData.board_name = selectedBoard.board_name;
        }

        // Trigger close button click
        angular.element('.btn-danger').trigger('click');

        // Submit Form
        $http({
            url: `${BASE_URL}/chatgpt/form`,
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param($scope.chatForm)
        }).then((response) => {
            console.log('response', response);
            if (response.data.status === true) {
                if (type === 0) {
                    $location.path(`/chatgpt/${response.data.form_req_Id}`);
                } else if (type === 1) {
                    $scope.getPaperQuestion();
                }
            } else {
                swal("Error", response.data.msg, "error");
            }
        });
    };

    $scope.postData = {};
    $scope.topic_gpt = [];
    $scope.get_questions = (index = null) => {
        $scope.post_data = $scope.query_post;
        var topic = '';
        var subtopic = '';
        var current_page = 1;
        var limit = 5;
        var gpt = 0;
        if (index != null) {
            var qus_num = document.getElementById('qus_num_' + index)
            limit = parseInt(qus_num.value);
            var page = document.getElementById('page_' + index)
            current_page = parseInt(page.value) + 1;
            topic = $scope.post_data.topics[index];
            if ($scope.post_data.subtopics)
                subtopic = $scope.post_data.subtopics[index];
            if ($scope.topic_gpt[index] != undefined)
                gpt = $scope.topic_gpt[index];
        }
        $scope.post_data.index = index;
        $scope.post_data.topic_id = topic;
        $scope.post_data.subtopic_id = subtopic;
        $scope.post_data.gpt = gpt;
        $scope.post_data.limit = limit;
        $scope.post_data.page = current_page;
        var qus_srn = 0;
        showLoader(true, index);
        $http({
            url: BASE_URL + "/chatgpt/get_questions",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param($scope.post_data)
        }).then(function (response) {
            ///
            if (response.data.access)
                $scope.access = response.data.access;
            if (response.data.error) {
                showLoader(false, index);
                swal("Error", response.data.error, "error");
                return false;
            }
            showLoader(false, index);
            var data = response.data.list;
            var qus_exists = 0;
            if (data != undefined && data.length) {
                for (var j = 0; j < data.length; j++) {
                    var topic_index = index != null ? index : j;
                    var topic_page = document.getElementById('page_' + topic_index)
                    $scope.renderQuestions(topic_index, gpt, data[j]);
                    if (data[j].questions.length > 0) {
                        topic_page.value = 1;
                    }
                    // else{
                    //     topic_gpt[index] = 1;
                    // }
                }
            }
            if (index != null) {
                if (data[0] != undefined && data[0].questions.length == 0) {
                    showLoader(true, index);
                    $scope.topic_gpt[index] = 1;
                    swal("Warning!", "No more Questions in our database, Please click on show more again for fetch question from GPT API", "warning");
                    if (gpt == 0)
                        $scope.get_questions(index);
                } else {
                    page.value = current_page;
                    if (qus_exists == 1) {
                        // alert(qus_exists);
                        // $scope.get_questions(index);
                    } else {
                        showLoader(false, index);
                    }
                }
            } else {
                showLoader(false, index);
            }
            removeHidden();
            ///
        });
    }
    $scope.renderQuestions = (topic_index, gpt, data) => {
        qus_srn = $("#topic_body_" + topic_index + " .qbox").length;
        var topic_body = angular.element(document.getElementById('topic_body_' + topic_index));
        var topic_page = document.getElementById('page_' + topic_index)
        for (var k = 0; k < data.questions.length; k++) {
            qus_exists = 0;
            qus_srn++;
            var q_data = data.questions[k];
            var red_box = '';
            if ($scope.editQusForm.id != undefined)
                if (q_data.id == $scope.editQusForm.id) {
                    $scope.verifyQuestion(q_data);
                }
            var html = `<div class="qbox ${red_box}">`;
            html += `<div>
                        <input type="checkbox" value="${q_data.id}" class="qus_cb form-check-input" name="q_ids[${topic_index}][]" data="${topic_index}">
                    </div>`;
            var processedQuestion = q_data.question.replace(/##(.*?)##/g, '_____');
            processedQuestion = processedQuestion.replace(/\n/g, '<br>');
            html += `<div class="q_div">
                        <a href="#" class="btn_my btn" data-bs-toggle="modal" data-bs-target="#exampleModal" ng-click="verifyQuestion(q_data,topic_index)">
                        <div class="qus_text">
                            <p class="qpara">
                                <span>Question ${qus_srn}:</span> 
                                <span id="qus_${q_data.id}">${processedQuestion}</span>
                            </p>
                            
                            ${q_data.image_path ? `<div class="img_box"><img id="img_qus_${q_data.id}" src="${BASE_URL}/chatgpt/get_aws_image/${q_data.id}/${q_data.image_path}?v=${q_data.id}" class="img-fluid qus_img"></div>` : ''}
                            ${gpt === 1 ? '<img src="assets/images/new_icon.png" class="img-responsive" style="height:30px;display: inline-block;">' : ''}
                        </div>`;
            var options = q_data.options;
            if (options.length > 0) {
                html += `<div class="options">`;
                if (q_data.question_type == "2") { //Subjective
                    html += `<div class="ans-list">`;
                    html += `<label> Ans: </label> <span>${options[0].option_text}</span> `;
                    if (options[0].image_path)
                        html += `<div class="img_box"><img id="img_qus_${options[0].id}" src="${BASE_URL}/chatgpt/get_aws_image/${q_data.id}/${options[0].image_path}?v=${options[0].id}" class="img-fluid qus_img"></div>`;
                    html += `</div>`;
                } else {
                    html += `<ol class="custom-ordered-list">`;
                    for (key in options) {
                        var green = options[key].is_correct == '1' ? 'green' : '';
                        html += `<li class="${green}">${options[key].option_text}`;
                        if (options[key].image_path)
                            html += `<div class="img_box"><img id="img_qus_${options[key].id}" src="${BASE_URL}/chatgpt/get_aws_image/${q_data.id}/${options[key].image_path}?v=${options[key].id}" class="img-fluid qus_img"></div>`;
                        html += `</li>`;
                    }
                    html += `</ol>`;
                }
                html += `</div>`;
            }
            html += `</a></div></div>`; //closed q_div, q_box div
            var compiledElement = $compile(html)($scope.$new(false));
            compiledElement.scope().q_data = q_data;
            compiledElement.scope().topic_index = topic_index;
            angular.element(topic_body).append(compiledElement);
        }
    }
    $scope.bandDiv = (q) => {
        let paper_marks = parseFloat(q.paper_marks);
        let given_marks = parseFloat(q.given_marks);
        // alert(parseInt(q.given_marks));
        var band_div = '';
        if (q.answer.skip != undefined) {
            color_band = 'black';
        }
        else if (given_marks == 0 && parseInt(q.checked) == 1) {
            color_band = 'red';
        }
        else if (given_marks > 0) {
            var color_band = '';
            var avg = (given_marks * 100) / paper_marks;
            if (avg < 60) {
                color_band = 'orange';
            } else if (avg < 90) {
                color_band = 'blue';
            } else {
                color_band = 'green';
            }
        } else if (parseInt(q.checked) == 1 && parseInt(q.given_marks) == 0) {
            color_band = 'orange';
        } else {
            color_band = 'gray';
        }
        band_div = '<div class="square square-lg ' + color_band + '"><small></small></div>';
        return $sce.trustAsHtml(band_div);
    }
    $scope.startPaper = (p) => {
        if (p.attempt_status == 1) {
            $location.path('/paper-report/' + p.id);
            return;
        }
        $http({
            url: BASE_URL + "/chatgpt/attempt_paper/" + p.id,
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Content-Type': 'application/json',
            },
            // data: $.param(postData)
        }).then(function (response) {
            if (response.data.status == true) {
                if (response.data.completed) {
                    $location.path('/paper-report/' + p.id);
                    return;
                } else {
                    $location.path('/start-paper/' + p.id);
                }
            }
            else {
                alert(response.data.msg);
                $location.path('/papers-test');
                return false;
            }
        });
    }
    $scope.qusForm.attempt_answer = [];
    $scope.handleDrop = (dropedElement, draggedElement) => {
        let id = $(dropedElement).data('id');
        let value = $(draggedElement).data('value');
        $scope.qusForm.attempt_answer[id] = value;
    }
    $scope.remainingTime = 0;
    $scope.graceTime = 0;
    $scope.timer_text = '00:00';
    $scope.updateTimer = () => {
        //This duration for taking time for give answer
        $scope.qusForm.duration++;
        if ($scope.remainingTime <= 0) {
            if ($scope.graceTime > 0) {
                $scope.remainingTime = $scope.graceTime;
                $scope.graceTime = 0;
                alert("Paper Time over, Grace Time Start!");
            } else {
                $scope.stopTimer();
                alert(" Time's up!");
                // $scope.paper_over();
                $location.path('/paper-report/' + $routeParams.id);
            }
        } else {
            const minutes = Math.floor($scope.remainingTime / 60);
            const seconds = $scope.remainingTime % 60;
            $scope.timer_text = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            $scope.remainingTime--;
            $scope.syncTimer();
        }
    }
    $scope.paperMode = 'start';
    $scope.resumePaper = (action = null) => {
        $scope.paperMode = action;
        $scope.qusForm.action = action;
        if (action == 'start') {
            $scope.startTimer();
            //$scope.attempt_paper();
        } else if (action == 'pause') {
            $scope.stopTimer();
        }
        $scope.qusForm.action = action;
        $http({
            url: BASE_URL + "/chatgpt/attempt_paper/" + $routeParams.id,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param($scope.qusForm)
        }).then(function (response) {
            // alert(response.data.msg);
        });
    }
    $scope.paper_over = () => {
        $scope.qusForm.action = 'submit';
        $http({
            url: BASE_URL + "/chatgpt/attempt_paper/" + $routeParams.id,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param($scope.qusForm)
        }).then(function (response) {
            alert('Thank you for successfully completing the paper.');
            if ($routeParams.id)
                $location.path('/paper-report/' + $routeParams.id);
        });
    }
    $scope.syncTimer = () => {
        $http({
            url: BASE_URL + "/chatgpt/paper_sync_timer/" + $scope.paper_data.id,
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Content-Type': 'application/json',
            },
            // data: $.param(postData)
        }).then(function (response) {
            if (response.data.expired == true) {
                if ($routeParams.id)
                    $location.path('/paper-report/' + $routeParams.id);
            }
            if (response.data.status == false) {
                $scope.stopTimer();
                alert(" Time's up!");
                $scope.paper_over();
            }
        });
    }
    $scope.timer = 0; // Initialize the timer
    var intervalPromise; // Variable to hold the interval reference
    // Start Timer
    $scope.startTimer = function () {
        if (!intervalPromise) { // Prevent multiple intervals
            intervalPromise = $interval(function () {
                $scope.updateTimer();
            }, 1000); // Increase the timer every second
        }
    };
    // Stop Timer
    $scope.stopTimer = function () {
        if (intervalPromise) {
            $interval.cancel(intervalPromise); // Stop the interval
            intervalPromise = null; // Reset the interval reference
        }
    };
    // Optional: Clean up the interval on scope destroy to prevent memory leaks
    $scope.$on('$destroy', function () {
        if (intervalPromise) {
            $interval.cancel(intervalPromise);
        }
    });
    $scope.current_qus_index = 0;
    $scope.exam_q_ids = [];
    //Load First function when start paper
    $scope.getProgressPercentage = function () {
        if (!$scope.paper_data || !$scope.paper_data.exam_q_ids || $scope.paper_data.exam_q_ids.length === 0) return 0;
        let total = $scope.paper_data.exam_q_ids.length;
        let current = $scope.current_qus_index + 1;
        return Math.round((current / total) * 100);
    };
    $scope.jumpQuestion = (q_id, index) => {
        if ((index - 1) > $scope.paper_data.total_ans) {
            swal("Warning!", "You cannot skip over an unanswered question.", "warning");
            return false;
        }
        if (index == 1) {
            $scope.previous = 0;
        } else {
            $scope.previous = 1;
        }
        $scope.current_qus_index = index;
        if (q_id != null) {
            $scope.getQuestion(q_id);
        }
    }
    $scope.previous = 1; //Previous button show
    $scope.previousQuestion = () => {
        if ($scope.current_qus_index == 1) {
            $scope.previous = 0;
        }
        $scope.current_qus_index -= 1;
        let q_id = $scope.paper_data.exam_q_ids[$scope.current_qus_index];
        $scope.getQuestion(q_id);
    }
    $scope.nextQuestion = async (q, skip = null) => {
        if ($scope.paperMode == 'pause') {
            alert("Papser is Pause, Pleaser start again");
            return false;
        }
        $scope.reset = 0;
        if (skip == null) {
            if ($scope.ans_image) {
                $('.page-loader-wrapper').show();
                $scope.importFileData = q;
                $scope.importFileData.q_id = q.id;
                $scope.qusForm.ans_image = await $scope.importFile($scope.ans_image);
                $('.page-loader-wrapper').hide();
            }
            if (q.question_type == 2) {
                // if ($scope.ans_image) {
                //     $scope.importFileData = q;
                //     $scope.qusForm.ans_image = await $scope.importFile($scope.ans_image);
                // }
                // else if (!$scope.qusForm.text_ans && !$scope.ans_image) {
                //     alert('Please enter your answer or upload answer'); return false;
                // }
            } else {
                // if (!$scope.qusForm.correct_ans) {
                //     alert('Please give your answer'); return false;
                // }
            }
        } else {
            $scope.qusForm.skip = 1;
            // $scope.skipQus[q.num] = 1;
        }
        $scope.qusForm.q_id = q.id;
        $scope.qusForm.action = 'save';
        $scope.qusForm.question_type = q.question_type;
        $http({
            url: BASE_URL + "/chatgpt/attempt_paper/" + $routeParams.id,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Content-Type': 'application/json',
            },
            data: $.param($scope.qusForm)
        }).then(function (response) {
            if (response.data.access)
                $scope.access = response.data.access;
            if (response.data.status == false) {
                if (response.data.expired == true)
                    $location.path('/paper-report/' + $routeParams.id);
                alert(response.data.msg);
                return false;
            }
            if (response.data.completed) {
                // alert('Thank you for successfully completing the paper.');
                // $location.path('/paper-report/' + $routeParams.id);
                // return;
            }
            $scope.previous = 1;
            if ($scope.ans_image) {
                // document.getElementById('fileInput').value = '';
                document.querySelector('.ans_image').value = '';
                $scope.ans_image = null;
            }
            $scope.qusForm = { sort: 'asc', duration: 0 };
            $scope.current_qus_index += 1;
            if ($scope.paper_data.exam_q_ids) {
                if ($scope.paper_data.exam_q_ids.length == $scope.current_qus_index) {
                    $scope.current_qus_index -= 1;
                    $scope.getQuestion($scope.paper_data.exam_q_ids[$scope.current_qus_index]);
                    alert('All questions attempted. Please submit the paper');
                } else {
                    $scope.getQuestion($scope.paper_data.exam_q_ids[$scope.current_qus_index]);
                }
            }
        });
    }
    $scope.hours = Array.from({ length: 24 }, (_, i) => i + 1);
    $scope.minutes = Array.from({ length: 60 }, (_, i) => i);
    $scope.updateEndDate = function () {
        if ($scope.paperForm.paper_type == '2') {
            $scope.paperForm.end_date = $scope.paperForm.start_date;
        }
    };
    $scope.paperForm = {
        paper_type: "",
        start_hour: $scope.hours[11],
        start_minute: $scope.minutes[0],
        end_hour: $scope.hours[12],
        end_minute: $scope.minutes[0],
        grace_time: ""
    };
    $scope.renderHTMLText = (text) => {
        var cc = $sce.trustAsHtml('' + text);
        // return $compile(cc)($scope);
        // console.log(cpc);
        // return cpc;
        // Append the compiled content to a container element
        // angular.element(document.getElementById('aaaa')).append(cpc);
    }
    $scope.version = new Date().getTime();
    $scope.importFileData = {};
    $scope.importFile = async (import_file) => {
        return new Promise((resolve, reject) => {
            var doc = new FormData();
            doc.append("file_name", "import_file");
            if ($scope.importFileData) {
                if ($scope.importFileData.q_id == undefined) {
                    if ($scope.importFileData.board_id == undefined || $scope.importFileData.subject_id == undefined) {
                        swal("Warning!", "Invalid File data", "warning");
                        return false;
                    }
                } else {
                    doc.append("q_id", $scope.importFileData.q_id);
                }
                doc.append("board_id", $scope.importFileData.board_id);
                if ($scope.importFileData.class_id != undefined)
                    doc.append("class_id", $scope.importFileData.class_id);
                if ($scope.importFileData.subject_id != undefined)
                    doc.append("subject_id", $scope.importFileData.subject_id);
                // if ($scope.importFileData.class_name != undefined)
                //     doc.append("class_name", $scope.importFileData.class_name);
                // if ($scope.importFileData.subject_name != undefined)
                //     doc.append("subject_name", $scope.importFileData.subject_name);
            } else {
                swal("Warning!", "Invalid file data", "warning");
                return false;
            }
            if (angular.isDefined(import_file)) {
                doc.append("import_file", import_file);
            }
            $http({
                url: BASE_URL + "/chatgpt/import_file",
                method: "POST",
                headers: {
                    "Content-Type": undefined,
                },
                data: doc,
            }).then(function (response) {
                data = response.data;
                if (data.status === true) {
                    resolve(response.data.file_name)
                }
            });
        });
    };
    $scope.importImageData = {};
    $scope.importCSV = async (import_csv) => {
        return new Promise((resolve, reject) => {
            var doc = new FormData();
            doc.append("file_name", "import_csv");
            doc.append("paper_title", $scope.importForm.paper_title);
            doc.append("academic_year_id", $scope.importForm.academic_year_id);
            doc.append("board_id", $scope.importForm.board_id);
            doc.append("class_id", $scope.importForm.class_id);
            doc.append("subject_id", $scope.importForm.subject_id);
            doc.append("folder", $scope.importForm.folder);
            if ($scope.importForm.new_folder != undefined)
                doc.append("new_folder", $scope.importForm.new_folder);
            if (angular.isDefined(import_csv)) {
                doc.append("import_csv", import_csv);
            }
            $http({
                url: BASE_URL + "/chatgpt/import_csv",
                method: "POST",
                headers: {
                    "Content-Type": undefined,
                },
                data: doc,
            }).then(function (response) {
                data = response.data;
                if (data.status === true) {
                    $location.path('/questions');
                    resolve(response.data)
                }
                resolve(response.data)
            });
        });
    };
    $scope.importForm = {};
    $scope.import_images = async () => {
        $('.page-loader-wrapper').show();
        var response = null;
        if ($scope.images) {
            response = await $scope.importImages($scope.images);
        }
        else {
            swal("Warning!", "Invalid File, Please select correct image files", "warning");
            return false;
        }
        $('.page-loader-wrapper').hide();
        if (response.data.status == true) {
            swal("Info!", response.data.msg, "success");
        } else {
            swal("Warning!", response.data.msg, "warning");
        }
    }
    $scope.get_folder_list = () => {
        $http({
            url: BASE_URL + "/chatgpt/get_folder_list",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param($scope.importForm)
        }).then(function (response) {
            $scope.folder_list = response.data.folder_list;
        });
    }
    $scope.generatePDF = (type) => {
        let g_ids = [];
        const cb = document.querySelectorAll(".qus_cb:checked");
        if (cb.length == 0) {
            alert('Please select at least one question.');
            return false;
        } else {
            for (let i = 0; i < cb.length; i++) {
                g_ids.push(cb[i].value)
            }
        }
        const postData = {
            q_ids: g_ids,
            type: type,
            prompt: $('.prompt').text()
        };
        $http({
            url: BASE_URL + "/chatgpt/generate_pdf",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Content-Type': 'application/json',
            },
            data: $.param(postData)
        }).then(function (response) {
            if (response.data.status == true) {
                var pdfUrl = 'download.pdf';
                window.open(pdfUrl, '_blank');
            }
        });
    }
    $scope.genQuestionLoader = 0;
    $scope.genSimilarQuestion = () => {
        let g_id = '';
        const cb = document.querySelectorAll(".qus_cb:checked");
        if (cb.length == 0) {
            alert('Please select the question.');
            return false;
        }
        else if (cb.length > 2) {
            alert('Please select only one question.');
            return false;
        } else {
            g_id = cb[0].value;
        }
        var postData = $scope.post_data;
        // var postData = $rootScope.query_post;
        var index = $(cb).attr('data');
        if (index != null) {
            var qus_num = document.getElementById('qus_num_' + index)
            limit = parseInt(qus_num.value);
            var page = document.getElementById('page_' + index)
            current_page = parseInt(page.value) + 1;
        }
        postData.topic_id = $scope.post_data.topics[index];
        postData.g_id = g_id;
        postData.numQuestions = $scope.post_data.qus_num[index];
        if ($('#ans_' + g_id).length == 1) {
            postData.type = 'subjective';
        } else {
            postData.type = 'mcq';
        }
        $scope.genQuestionLoader = 1;
        $http({
            url: BASE_URL + "/chatgpt/gen_sim_qus",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Content-Type': 'application/json',
            },
            data: $.param(postData)
        }).then(function (response) {
            var data = response.data;
            if (data.questions && data.questions.length > 0) {
                $scope.renderQuestions(index, 0, data);
                /*
                var topic_index = index;
                var topic_body = document.getElementById('topic_body_' + topic_index);
                var qus_srn = $("#topic_body_" + topic_index + " .qbox").length;
                for (var k = 0; k < data.questions.length; k++) {
                    qus_srn++;
                    var q_data = data.questions[k];
                    var html = '<div class="qbox">';
                    html += '<input type="hidden" id="descriptor_' + q_data.id + '" value="' + q_data.descriptor + '">';
                    html += '<input type="hidden" id="marks_' + q_data.id + '" value="' + q_data.marks + '">';
                    html += '<input type="hidden" id="difficulty_level_' + q_data.id + '" value="' + q_data.difficulty_level + '">';
                    html += '<div><input type="checkbox" value="' + q_data.id + '" class="qus_cb form-check-input" name="q_ids[' + topic_index + '][]" data="' + topic_index + '"></div>';
                    html += '<div><a href="#" class="btn_my btn" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="editQuestion(' + q_data.id + ',' + topic_index + ')"><div class="qus_text">'
                    html += '<p class="qpara"><span>Question ' + qus_srn + ':</span> ';
                    html += ' <span id="qus_' + q_data.id + '">' + q_data.question + '</span></p>'
                    html += '<img src="assets/images/new_icon.png" class="img-responsive" style="height:30px;display: inline-block;">';
                    html += '</div>';
                    if (q_data.options == null || q_data.options == 'null' || q_data.options == '') {
                        q_data.options = '{}';
                    }
                    var options = JSON.parse(q_data.options);
                    var opt_length = 0;
                    if (options.length > 0) {
                        opt_length = options.length
                    } else {
                        opt_length = Object.keys(options).length
                    }
                    if (opt_length > 0) {
                        html += '<div class="options" id="opt_' + q_data.id + '">';
                    } else {
                        html += '<div class="options" id="ans_' + q_data.id + '">';
                    }
                    if (q_data.ans != '' && q_data.ans != null && q_data.ans != 'null') {
                        html += '<div class="ans-list">';
                        html += '<label> Ans: </label> <span>' + q_data.ans + '</span>';
                        html += '</div>';
                    } else {
                        html += '<ol class="custom-ordered-list">';
                        var m = 0;
                        for (key in options) {
                            if (options[key] && options[key] != '') {
                                var green = ((m + 1) == q_data.correct_answer) ? 'green' : '';
                                html += '<li class="' + green + '">' + options[key] + '</li>';
                            }
                            m++
                        }
                        html += '</ol>';
                    }
                    html += '</div>';
                    html += '</a><div></div>';
                    topic_body.innerHTML += html;
                }*/
                var q_data = data.questions[0];
                $('html, body').animate({
                    scrollTop: $("#qus_" + q_data.id).offset().top
                }, 200);
            }
            if (data.error != undefined) {
                alert(data.error);
            }
            $scope.genQuestionLoader = 0;
        });
    }
    $scope.dateFormat = (date, format = null) => {
        if (date) {
            if (format == null) format = 'd MMM yyyy HH:mm';
            if (isNaN(new Date(date))) {
                return '- -';
            }
            formatDate = $filter('date')(new Date(date), format);
            return formatDate;
        } else {
            return '- -';
        }
    }
})
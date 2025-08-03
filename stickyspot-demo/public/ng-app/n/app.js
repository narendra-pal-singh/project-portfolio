var tmpObj;
var leadScope = null;
var CRMAPP = angular.module("crmApp", ["ngRoute"])
    .run(function ($rootScope, $location) {
        console.log('angular run');
    })
    .controller("singupController", function ($scope, $http) {

        $scope.userFormData = {};
        $scope.step = 1;
        $scope.errorMsg = '';
        $scope.singUp = () => {

            if ($scope.userFormData.password != $scope.userFormData.cpassword) {
                $scope.errorMsg = 'Confirm password does not matching, Please enter correct';
                return false;
            } else {
                $scope.errorMsg = '';
            }

            $scope.step += 1;

            if ($scope.step == 3) {
                showLoader(true);
                let token = $("input:hidden[name='token']").val();
                $http({
                    url: BASE_URL + "/user/store",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param($scope.userFormData) + "&token=" + token
                }).then(function (response) {
                    data = response.data;
                    if (data.status === true) {
                        $scope.step += 1;
                    } else {
                        $scope.errorMsg = data.msg;
                        $scope.step = 1;
                    }
                    //$scope.userFormData.token = data.token;
                    //$("input:hidden[name='token']").val(data.token);
                });
            }
        }
    })
    .controller("teamController", function ($scope, $http, $location) {
        // $scope.getLeadDepartment = () => {
        //     let token = $("input:hidden[name='token']").val();
        //     $http({
        //         url: BASE_URL + "/department",
        //     }).then(function (response) {
        //         $scope.leadSourceList = response.data.sources;
        //     });
        // }
        

        $scope.getDepartments = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/departments",
            }).then(function (response) {
                $scope.departments = response.data.departments;
            });
        }

        $scope.getDepartments();
        
        $scope.addDepartment = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/department/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.leadDepartmentForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.editDepartmentForm = {};
                    //append data
                    $scope.getDepartments();
                } else {
                    //alert message
                    console.log('error creating lead department');
                }
            });
        }

        $scope.editDepartmentForm = {};
        $scope.saveLeadDepartment = (department_id) => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/department/update",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.editDepartmentForm[department_id]) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.editDepartmentForm = {};
                    //append data
                    $scope.getDepartments();
                } else {
                    //alert message
                    console.log('error saving lead source');
                }
            });
        }

        $scope.changeDepartmentStatus = (department) => {
            console.log('changeDepartmentStatus', department);
            if (department.status == 1) {
                $scope.editDepartmentForm[department.id].status = 0;
            } else {
                $scope.editDepartmentForm[department.id].status = 1;
            }
        }

        $scope.showEditDepartment = (el, department) => {
            console.log('showEditDepartment', department);
            $scope.editDepartmentForm[department.id] = department;

            angular.element(document.querySelectorAll(".department-title-" + department.id)).addClass('hidden');
            angular.element(document.querySelectorAll(".department-title-" + department.id)).removeClass('btnDiv');

            angular.element(el.target).parent().parent().addClass('showLead');

        }
        $scope.hideEditDepartment = () => {
            angular.element(document.querySelectorAll(".department_list li")).removeClass("showLead");
            angular.element(document.querySelectorAll(".dd-handle")).removeClass('hidden');

            angular.element(document.querySelectorAll(".editBtnDiv")).addClass('btnDiv');
            angular.element(document.querySelectorAll(".editBtnDiv")).removeClass('hidden');
        }
    })
    .controller("leadController", function ($scope, $http, $location) {
        console.log('leadController');
        $scope.leadFormData = {};
        $scope.leadList = [];

        leadScope = $scope;        

        $scope.uploadLeadFile = () => {

            var element = document.getElementById("upload_csv_file");
            var file = element.files[0];
            console.log(file.name);
            console.log(file);
            var loFormData = new FormData();
            loFormData.append("filename", file.name);
            loFormData.append("file", file);
            loFormData.append("source_type", $scope.source_type);

            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/leads/import",
                method: "POST",
                headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded'
                    //'Content-Type': 'multipart/form-data'
                    //'Content-Type': 'application/json'
                    'Content-type': undefined,
                    'Process-Data': false
                },
                //data: $.param($scope.leadSourceForm) + "&token=" + token
                data: loFormData
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    alert('Import file successfully');
                    $location.path('/contacts');
                } else {
                    //alert message
                    console.log('error creating lead source');
                }
            });
        }

        $scope.getCSVTemplate = function (csvType) {
            var page = "tools/csvTemplate.php?csvType=" + csvType;
            document.location.href = page;
        }
        $scope.exportLead = () => {
            var page = BASE_URL + "/leads/export/" + $scope.source_type;
            document.location.href = page;
        }

        // $scope.exportLead = () =>{
        //     let token = $("input:hidden[name='token']").val();
        //     $http({
        //         url: BASE_URL + "/leads/export",
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //         },
        //         data: "sid="+$scope.source_type+ "&token=" + token
        //     }).then(function (response) {
        //         data = response.data;
        //         if (data.status == true) {
        //             alert(data.msg);
        //         } else {
        //             //alert message
        //             console.log('error creating lead source');
        //         }
        //     });
        // }

        $scope.getLeadSources = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/leads/sources",
            }).then(function (response) {
                $scope.leadSourceList = response.data.sources;
            });
        }

        $scope.addLeadSource = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/leads/source/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.leadSourceForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.leadSourceForm = {};
                    //append data
                    $scope.getLeadSources();
                } else {
                    //alert message
                    console.log('error creating lead source');
                }
            });
        }
        $scope.leadEditSourceForm = {};
        $scope.saveLeadSource = (source_id) => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/leads/source/update",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.leadEditSourceForm[source_id]) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.leadEditSourceForm = {};
                    //append data
                    $scope.getLeadSources();
                } else {
                    //alert message
                    console.log('error saving lead source');
                }
            });
        }
        $scope.changeSourceStatus = (source) => {
            console.log('changeSourceStatus', source);
            if (source.status == 1) {
                $scope.leadEditSourceForm[source.id].status = 0;
            } else {
                $scope.leadEditSourceForm[source.id].status = 1;
            }
        }

        $scope.showEditSource = (el, source) => {

            $scope.leadEditSourceForm[source.id] = source;

            angular.element(document.querySelectorAll(".lead-title-" + source.id)).addClass('hidden');
            angular.element(document.querySelectorAll(".lead-title-" + source.id)).removeClass('btnDiv');

            angular.element(el.target).parent().parent().addClass('showLead');

        }
        $scope.hideEditSource = () => {
            angular.element(document.querySelectorAll(".source_list li")).removeClass("showLead");
            angular.element(document.querySelectorAll(".dd-handle")).removeClass('hidden');

            angular.element(document.querySelectorAll(".editBtnDiv")).addClass('btnDiv');
            angular.element(document.querySelectorAll(".editBtnDiv")).removeClass('hidden');
        }


        $scope.getLeadStags = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/leads/stages",
                // method: "POST",
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded'
                // },
                //data: $.param($scope.userFormData) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.leads != undefined)
                    $scope.leadList = data.leads;
                if (data.cData != undefined)
                    loadFunnalChart(data.cData);

            });
        }
        $scope.addStage = () => {

            let token = $("input:hidden[name='token']").val();

            $http({
                url: BASE_URL + "/leads/stage/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.leadFormData) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.leadFormData = {};
                    //append data
                    $scope.getLeadStags();
                } else {
                    //alert message
                    // console.log('error saving');
                }
            });
        }

        $scope.updateOrder = (orderData) => {
            $http({
                url: BASE_URL + "/leads/stage/change_order",
                method: "POST",
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded'
                // },
                //data: $.param([{'id':1},{'id':2},{'id':13}])
                data: JSON.stringify({ order: orderData })
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    //append data
                    $scope.getLeadStags();
                } else {
                    //alert message
                }
            });
        }

        $scope.leadDiv = false;
        $scope.leadEditForm = {};

        $scope.hideEditItem = () => {

            angular.element(document.querySelectorAll(".dd-list li")).removeClass("showLead");
            angular.element(document.querySelectorAll(".dd-handle")).removeClass('hidden');

            angular.element(document.querySelectorAll(".editBtnDiv")).addClass('btnDiv');
            angular.element(document.querySelectorAll(".editBtnDiv")).removeClass('hidden');

        }
        $scope.showEditItem = (el, lead) => {

            $scope.leadEditForm[lead.id] = lead;

            angular.element(document.querySelectorAll(".lead-title-" + lead.id)).addClass('hidden');
            angular.element(document.querySelectorAll(".lead-title-" + lead.id)).removeClass('btnDiv');

            angular.element(el.target).parent().parent().addClass('showLead');

        }

        $scope.updateStage = (el, lead) => {

            let token = $("input:hidden[name='token']").val();

            $http({
                url: BASE_URL + "/leads/stage/update",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.leadEditForm[lead.id]) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.leadFormData = {};
                    //append data
                    $scope.getLeadStags();
                } else {
                    //alert message
                }
            });
        }
    })
    .controller("adController", function ($scope, $http, $location) {
        $scope.adAccountsForm = {};
        $scope.adPagesForm = {};
        $scope.userData = {};
        $scope.isAdConnect = () => {
            $http({
                url: BASE_URL + "/ads/connected",
            }).then(function (response) {
                var userData = response.data;
                if (userData && userData.user && userData.user.ad_connected == 1) {
                    $scope.userData = userData.user;
                    $location.path('/ads/campaign');
                } else {
                    //Redirect to Connect Page
                    $location.path('/ads');
                }
            });
        };

        $scope.getUserAdAccounts = () => {
            $http({
                url: BASE_URL + "/ads/accounts",
            }).then(function (response) {
                $scope.userAccounts = response.data;
                if ($scope.userAccounts) {
                    $scope.selectAdAccount = $scope.userAccounts[0].account_id;
                    $scope.getCampaigns($scope.selectAdAccount);
                }
                console.log('userAccounts', $scope.userAccounts);
            });
        }

        $scope.getFBAdAccounts = () => {
            showLoader(true);
            $http({
                url: BASE_URL + "/ads/fbaccounts",
            }).then(function (response) {
                $scope.accountData = response.data;
                console.log('accountData', $scope.accountData);
                showLoader(false);
            });
        }

        $scope.adaccountsSelectAll = () => {
            // for (index in $scope.accountData.adaccounts) {
            //     if ($scope.adAccountsForm.selectAll == undefined) {
            //         $scope.adAccountsForm.accounts[index][adaccounts.account_id] = true;
            //     } else if ($scope.adAccountsForm.selectAll == true) {
            //         $scope.adAccountsForm.accounts[index][adaccounts.account_id] = false;
            //     } else {
            //         $scope.adAccountsForm.accounts[index][adaccounts.account_id] = true;
            //     }
            // }
            var tmp = {};
            var key = 0;
            for (index in $scope.accountData.adaccounts) {
                key = $scope.accountData.adaccounts[index].account_id;
                console.log("key", key);
                if ($scope.adAccountsForm.selectAll == undefined)
                    tmp[key] = true;
                else if ($scope.adAccountsForm.selectAll == true)
                    tmp[key] = false;
                else
                    tmp[key] = true;

            }
            //console.log('tmp',tmp);
            $scope.adAccountsForm.accounts = tmp;
            console.log('discard form', $scope.adAccountsForm.accounts);
        }

        $scope.saveAdAccounts = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/ads/fbaccounts",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.adAccountsForm) + "&token=" + token
            }).then(function (response) {
                //redirect Account Pages after successfully
                if (response.data.status === true) {
                    $location.path('/ads/pages');
                } else {
                    alert(response.data.msg);
                }
            });
        }

        $scope.getAdPages = () => {
            showLoader(true);
            $http({
                url: BASE_URL + "/ads/pages",
            }).then(function (response) {
                $scope.pagesData = response.data;
                console.log('accountData', $scope.pagesData);
                showLoader(false);
            });
        }
        $scope.saveAdPages = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/ads/pages",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.adPagesForm) + "&token=" + token
            }).then(function (response) {
                if (response.data.status === true) {
                    $location.path('/ads/campaign');
                } else {
                    alert(response.data.msg);
                }
            });
        }
        $scope.disconnectPage = (page) => {
            console.log('disconnectPage', page);
            swal({
                title: "Disconnect Page",
                text: `This page is already connected to stickyspot with this Company/User ${page.name} In order to use this page which your account, please click here to disconnect it with previously associated company/user.`,
                type: "info",
                confirmButtonText: "Confirm",
                //cancelButtonText: "Cancel",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function () {
                //Call http reqest to disconnect page 
                // setTimeout(function () {
                //     swal("Ajax request finished!");
                // }, 2000);
                //if (closeOnConfirm == true) {
                $http({
                    url: BASE_URL + "/page/disconnect",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(page)
                }).then(function (response) {
                    if (response.data.status === true) {
                        //$scope.pagesData.pages[]
                        for (var i = 0; i < $scope.pagesData.pages.length; i++) {
                            if ($scope.pagesData.pages[i].id == page.id)
                                $scope.pagesData.pages[i].connected = false;
                        }
                        setTimeout(function () {
                            swal(response.data.msg);
                        }, 1000);
                        return true;
                    } else {
                        alert(response.data.msg);
                        return false;
                    }
                });
                //}
            });
        }

        $scope.campaignAccountID = "";
        $scope.campaignsData = {};
        $scope.campaignsShowMore = "";
        $scope.getCampaigns = (account_id = 0, next = '') => {

            if ($scope.campaignAccountID == "")
                $scope.campaignAccountID = account_id;

            if ($scope.campaignAccountID != account_id)
                $scope.campaignsData = {};

            showLoader(true);

            $http({
                url: BASE_URL + "/ads/campaigns",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: "account_id=" + account_id + "&next=" + next
            }).then(function (response) {
                if ($scope.campaignsData.campaigns && response.data.campaigns) {
                    $scope.campaignsShowMore = response.data.getContactsshow_more;
                    $scope.campaignsData.campaigns = [...$scope.campaignsData.campaigns, ...response.data.campaigns];
                }
                else {
                    $scope.campaignsData = response.data;
                    $scope.campaignsShowMore = "";
                }
                showLoader(false);
            });
        }
    })
    .directive('ngRepeatScrollDown', function () {
        return function (scope, element, attrs) {
            if (scope.$last) {
                console.log('ngRepeatScrollDown');
            }
        }
    })
    .controller("contactController", function ($scope, $http, $anchorScroll, $location, $timeout, $filter, $routeParams) {

        $scope.runLoader = true;

        //$scope.dayOfWeek = { "Monday":"M", "Tuesday":"T","":"W","Thursday":"T","Friday":"F", "Saturday":"S", "Sunday":"S" };
        //$scope.dayOfWeek = { "M": "Monday", "T": "Tuesday", "W": "Wednesday", "T": "Thursday", "F": "Friday", "S": "Saturday", "S": "Sunday" };
        $scope.weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        $scope.dayOfWeek = [];
        $scope.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        // $scope.scrollDiv = () =>{

        //     // console.log('listing height ',angular.element(document.querySelector('.listing'))[0].offsetHeight);
        //     // console.log('listing top ',angular.element(document.querySelector('.listing'))[0].scrollTop);
        //     // angular.element(document.querySelector('.listing'))[0].scrollTop = 500;
        //     //console.log('listing bottom ',angular.element(document.querySelector('.listing'))[0].scrollBottom);

        //     angular.element(document.querySelector('.chat-history'))[0].scrollTop = 500;

        // }

        $scope.setDay = (index, v) => {
            console.log('index=' + index + "=v=" + v);

            if ($scope.dayOfWeek[index] == v) {
                $scope.dayOfWeek[index] = '';
            } else {
                $scope.dayOfWeek[index] = v;
            }

            var empties = $scope.dayOfWeek.length - $scope.dayOfWeek.filter(String).length;

            if (empties == 7) {
                console.log('empties');
                $timeout(function () {
                    console.log('set default day')
                    var d = new Date();
                    let day = d.getDay();
                    $scope.dayOfWeek[day] = $scope.weekDays[day];
                    console.log('dayOfWeek', $scope.dayOfWeek)
                }, 500);
            }
        }

        $scope.taskForm = {};
        $scope.createTask = () => {
            if ($scope.contactData.id == undefined) {
                alert('Invalid contact note');
                return false;
            }
            console.log('createTask', $scope.taskForm)

            $scope.taskForm.cid = $scope.contactData.id;

            $scope.taskForm.repeat_on = $scope.dayOfWeek;
            console.log('taskForm.repeat_on', $scope.taskForm.repeat_on);
            //$scope.dayOfWeek = [];

            //angular.element(document.querySelector('.addNote')).hide();
            $http({
                url: BASE_URL + "/contact/task/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.taskForm)
            }).then(function (response) {
                
                var data = response.data;
                if (data.status == true) {
                    $scope.taskForm = {};
                    //Add New Task in Task Object
                    if (data.task) {
                        var task = data.task;
                        for (index in task) {

                            for (nYear in task[index]) {
                                var yFlag = 0, mFlag = 0;
                                for (nMonth in task[index][nYear]) {

                                    for (year in $scope.contactData.activity) {
                                        console.log('nYear == year', nYear + '==' + year)
                                        if (nYear == year) {
                                            yFlag = 1;
                                            for (month in $scope.contactData.activity[year]) {
                                                console.log('nMonth == month', nMonth + '==' + month)
                                                if (nMonth == month) {
                                                    mFlag = 1;
                                                    //append
                                                    $scope.contactData.activity[year][month].tasks.data = [task[index][nYear][nMonth]].concat($scope.contactData.activity[year][month].tasks.data)
                                                }
                                            }
                                        }
                                    }
                                    if (yFlag == 1 && mFlag == 0) {
                                        console.log('add task of month');
                                        let new_task = {};
                                        new_task[nMonth] = { 'tasks': { 'data': [task[index][nYear][nMonth]] } }
                                        $scope.contactData.activity[nYear] = Object.assign(new_task, $scope.contactData.activity[nYear]);
                                        console.log('contactData.activity', $scope.contactData.activity)
                                    }
                                    if (yFlag == 0) {
                                        console.log('add task of year');
                                        $scope.contactData.activity = Object.assign({ nYear: { nMonth: { 'tasks': { 'data': task[index][nYear][nMonth] } } } }, $scope.contactData.activity);
                                    }

                                    // if ($scope.contactData.tasks[year]) {
                                    //     console.log('add task', task[index][year][month]);
                                    //     $scope.contactData.tasks[year][month] = [task[index][year][month]].concat($scope.contactData.tasks[year][month])
                                    // }
                                    // else {
                                    //     $scope.getTasks($scope.contactData.id);
                                    // }
                                }
                            }
                        }
                    }
                    $scope.initNote();
                    $('.hideCreateNote').trigger('click');
                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }
        $scope.getTasks = (contact_id) => {
            $http({
                url: BASE_URL + "/contact/tasks/" + contact_id,
            }).then(function (response) {
                
                console.log('response.data', response.data);
                $scope.contactData.tasks = response.data;
            });
        }

        $scope.editTask = [];
        $scope.setTaskData = (task_id, tKey, month, year) => {
            // var taskObj = $scope.contactData.tasks[year][month][tKey];
            var taskObj = $scope.contactData.activity[year][month].tasks.data[tKey];
            taskObj.due_date = new Date(taskObj.due_date);
            console.log('set Task edit', taskObj);
            $scope.editTask[task_id] = taskObj;
        }

        $scope.saveTask = (e, task_id, tKey, month, year) => {
           
            // console.log('saveTask', $scope.editTask[task_id]);
            // $scope.contactData.tasks[year][month][tKey] = $scope.editTask[task_id];
            $scope.contactData.activity[year][month].tasks.data[tKey] = $scope.editTask[task_id];;
            $http({
                url: BASE_URL + "/contact/task/edit",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.editTask[task_id]) + "&cid=" + $scope.contactData.id
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    console.log('update task');
                    //$(e).trigger('click');
                    //angular.element(e.target).trigger('click');
                    angular.element(e.target).siblings('.caneclNote').trigger('click');
                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }

        $scope.repeatTask = 0;
        $scope.confrimDeleteTask = (task, tKey, month, year) => {

            //if ($scope.contactData.tasks[year][month][tKey].set_to_repeat == "0") {
            if ($scope.contactData.activity[year][month].tasks.data[tKey].set_to_repeat == "0") {
                swal({
                    title: "Are you sure you want to delete the Task?",
                    text: "All the activity related to this Task along with comments will be deleted.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                }, function () {
                    //$scope.contactData.tasks[year][month].splice(tKey, 1);
                    $scope.contactData.activity[year][month].tasks.data.splice(tKey, 1);
                    $scope.deleteTask(task);
                });
            } else {
                $scope.repeatTask = task;
                $scope.delete_repeat_task = 'this';
                $('.popupBg, .popupBody').fadeIn();
            }
        }
        $scope.deleteTask = (task) => {

            if (!task) return false;
            $('.popupBg, .popupBody').fadeOut();

            $http({
                url: BASE_URL + "/contact/task/delete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'tid=' + task.id + "&pid=" + task.parent_id + "&action=" + $scope.delete_repeat_task
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    console.log('task deleted');
                    $scope.delete_repeat_task = "";
                    swal("Deleted!", "Task deleted successfully.", "success");
                    if ($scope.delete_repeat_task != 'this') {
                        $scope.getTasks($scope.contactData.id);
                    }
                    $scope.initNote();
                } else {
                    console.log(data.msg);
                }

            });
        }

        $scope.addTaskComment = (tKey, month, year, task_id) => {
            var postData = {
                'tid': task_id,
                'comment': $scope.commentText[task_id]
            };
            $scope.commentText[task_id] = "";
            $http({
                url: BASE_URL + "/task/comment/add",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param(postData)
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    //$scope.noteForm = {};
                   
                    $scope.getTaskComments(tKey, month, year, task_id);
                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }
        $scope.getTaskComments = (tKey, month, year, task_id) => {
            if ($scope.contactData.id == undefined) {
                alert('Invalid contact');
                return false;
            }
            $http({
                url: BASE_URL + "/task/comments/" + task_id,
            }).then(function (response) {
                console.log('response.data', response.data);
                //$scope.contactData.tasks[year][month][tKey].comments = response.data;
                $scope.contactData.activity[year][month].tasks.data[tKey].comments = response.data;
            });
        }
        $scope.toggleEdit = (id) => {
            $('.inputComment'+id).show();
            $('.inputComment'+id).focus();
            $('.textComment'+id).hide();
         }
        $scope.editTaskComment = (tKey, month, year, id, task_id) => {
           
            //alert($scope.commentText);
            var comment = $('.inputComment' + id).val();
            console.log(comment)
           // return;
            // $('.textComment'+id).show();
            // $('.inputComment' + id).hide();
            // return false;
            // var postData = {
            //     'cid': id,
            //     'comment': $scope.commentText[task_id]
            // };
            var postData = {
                     'cid': id,
                    'comment': comment
                 }
                
            $http({
                url: BASE_URL + "/task/comment/edit",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param(postData)
            }).then(function (response) {
                console.log(response.data);
                var data = response.data;
                if (data.status == true) {
                    //$scope.noteForm = {};
                    
                    swal("Success!", "Comment updated successfully.", "success");
                    
                    
                    $('.textComment'+id).show();
                    $('.inputComment' + id).hide();
                    setTimeout(function () {$scope.getTaskComments(tKey, month, year, task_id); },1500);
                    
                    
                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }
        $scope.deleteTaskComment = (cKey, tKey, month, year, comment_id,task_id) => {
            
            swal({
                title: "Are you sure you want to delete the Comment?",
                //text: "Are you sure you want to delete the Comment. ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                
                //$scope.contactData.activity[year][month].tasks.data[tKey]
               // $scope.contactData.tasks[year][month][tKey].comments.splice(cKey, 1);
                $http({
                    url: BASE_URL + "/task/comment/delete",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'cid=' + comment_id
                }).then(function (response) {
                    
                    var data = response.data;
                    if (data.status == true) {
                        //console.log(data.msg);
                        swal("Deleted!", "Comment deleted successfully.", "success");
                       
                     // $scope.getTaskComments(tKey, month, year, task_id);
                     $scope.getTaskComments(tKey, month, year, task_id);

                    } else {
                        //console.log(data.msg);
                    }
                });
            });

        }

        //Start Note Tab Functions

        $scope.initNote = () => {
            console.log('initNote==');

            var today = new Date();
            $scope.weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            $scope.dayOfWeek[today.getDay()] = $scope.weekDays[today.getDay()];

            setTimeout(function () {
                initNote();
            }, 500)
        }



        $scope.noteForm = {};
        $scope.createNote = () => {

            if ($scope.contactData.id == undefined) {
                alert('Invalid contact note');
                return false;
            }

            $scope.noteForm.cid = $scope.contactData.id;
            angular.element(document.querySelector('.addNote')).hide();
            $http({
                url: BASE_URL + "/contact/note/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.noteForm)
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    $scope.noteForm = {};
                    //Add Note in Note Object
                    if (data.note) {
                        var note = data.note;


                        // const startAdded = {'a':1 , ...obj};
                        // console.log(startAdded);

                        // const endAdded = {...obj, 'd':4};
                        // console.log(endAdded);

                        for (nYear in note) {
                            var yFlag = 0, mFlag = 0;
                            for (nMonth in note[nYear]) {
                                for (year in $scope.contactData.activity) {
                                    console.log('nYear == year', nYear + '==' + year)
                                    if (nYear == year) {
                                        yFlag = 1;
                                        for (month in $scope.contactData.activity[year]) {
                                            console.log('nMonth == month', nMonth + '==' + month)
                                            if (nMonth == month) {
                                                mFlag = 1;
                                                //append
                                                if (!$scope.contactData.activity[year][month].notes)
                                                    $scope.contactData.activity[year][month].notes = { 'data': [] };

                                                $scope.contactData.activity[year][month].notes.data = [note[nYear][nMonth]].concat($scope.contactData.activity[year][month].notes.data);

                                            }
                                        }
                                    }
                                }
                                if (yFlag == 1 && mFlag == 0) {
                                    console.log('add note of month');
                                    let new_note = {};
                                    new_note[nMonth] = { 'notes': { 'data': [note[nYear][nMonth]] } }
                                    $scope.contactData.activity[nYear] = Object.assign(new_note, $scope.contactData.activity[nYear]);
                                    console.log('contactData.activity', $scope.contactData.activity)
                                }
                                if (yFlag == 0) {
                                    console.log('add note of year');
                                    $scope.contactData.activity = Object.assign({ nYear: { nMonth: { 'notes': { 'data': note[nYear][nMonth] } } } }, $scope.contactData.activity);
                                }

                                // console.log('activity',$scope.contactData.activity);

                                // if(!$scope.contactData.activity[year]){
                                //     $scope.contactData.activity[year] = {};
                                // }
                                // if(!$scope.contactData.activity[year][month]){
                                //     $scope.contactData.activity[year][month] = {};
                                // }
                                // if(!$scope.contactData.activity[year][month].notes){
                                //     $scope.contactData.activity[year][month].notes = { 'date': '', 'data': [] };
                                // }

                                // $scope.contactData.activity[year][month].notes.data = [note[year][month]].concat($scope.contactData.activity[year][month].notes.data)



                                // if ($scope.contactData.notes[year]) {
                                //     console.log('add note', note[year][month]);
                                //     $scope.contactData.notes[year][month] = [note[year][month]].concat($scope.contactData.notes[year][month])
                                // }
                                // else {
                                //     // $scope.contactData.notes[year] = [];
                                //     // $scope.contactData.notes[year][month] = [];
                                //     //$scope.contactData.notes = note;
                                //     //$scope.contactData.notes = note; 
                                //     //console.log('push notes',$scope.contactData.notes);
                                //     $scope.getNotes($scope.contactData.id);
                                // }
                            }
                        }
                    }
                    $scope.initNote();
                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }
        $scope.editNote = [];
        $scope.setNoteText = (note_id, nKey, month, year, e) => {






            // console.log('set edit note', $scope.contactData.activity[year][month].notes.data[nKey])
            // console.log('nKey', nKey)
            //$scope.editNote[note_id] = $scope.contactData.notes[year][month][nKey].note;
            $scope.editNote[note_id] = $scope.contactData.activity[year][month].notes.data[nKey].note;

            // if(angular.element(document.querySelector(".activity_row")){

            // }

            if ($(e.target).closest('.activity_row').length > 0) {
                angular.element(document.querySelector(".activity_row .note-" + note_id + " .editNoteForm")).removeClass("hidden");
                angular.element(document.querySelector(".activity_row .note-" + note_id + " .viewNote")).addClass("hidden");
            }


            if ($(e.target).closest('.note_row').length > 0) {
                angular.element(document.querySelector(".note_row .note-" + note_id + " .editNoteForm")).removeClass("hidden");
                angular.element(document.querySelector(".note_row .note-" + note_id + " .viewNote")).addClass("hidden");
            }




            //var myEl = angular.element(element[0].querySelector('.list-scrollable'));

            //angular.element(e.target.querySelector('.editNoteForm')).removeClass('hidden');
            // e.target.querySelector('.editNoteForm').removeClass('hidden');
            //angular.element(document.querySelector('.contact-list-ui')).bind

            // $(e.target).find(".editNoteForm").show();
            //e.target.querySelector('.editNoteForm').show();

            // $(e.target).find('.editNoteForm').removeClass('hidden');
            //  $(e.target).find('.viewNote').addClass('hidden');
        }
        $scope.hideEditNote = (note_id, e) => {

            if ($(e.target).closest('.activity_row').length > 0) {
                angular.element(document.querySelector(".activity_row .note-" + note_id + " .editNoteForm")).addClass("hidden");
                angular.element(document.querySelector(".activity_row .note-" + note_id + " .viewNote")).removeClass("hidden");
            }


            if ($(e.target).closest('.note_row').length > 0) {
                angular.element(document.querySelector(".note_row .note-" + note_id + " .editNoteForm")).addClass("hidden");
                angular.element(document.querySelector(".note_row .note-" + note_id + " .viewNote")).removeClass("hidden");
            }

            // angular.element(document.querySelector(".note-" + note_id + " .editNoteForm")).addClass("hidden");
            // angular.element(document.querySelector(".note-" + note_id + " .viewNote")).removeClass("hidden");
        }

        $scope.saveNote = (note_id, nKey, month, year, e) => {
            console.log('saveNote');
            // $scope.hideEditNote(note_id);
            //$scope.contactData.notes[year][month][nKey].note = $scope.editNote[note_id];
            $scope.contactData.activity[year][month].notes.data[nKey].note = $scope.editNote[note_id];
            $http({
                url: BASE_URL + "/contact/note/edit",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'nid=' + note_id + "&note=" + $scope.editNote[note_id]
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    console.log('update note');
                    $scope.hideEditNote(note_id, e);
                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }

        $scope.deleteNote = (note_id, nKey, month, year) => {

            console.log('scope.contactData', $scope.contactData);

            swal({
                title: "Are you sure you want to delete the Note?",
                text: "All the activity related to this Note along with comments will be deleted.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                //$scope.contactData.notes[year][month].splice(nKey, 1);
                $scope.contactData.activity[year][month].notes.data.splice(nKey, 1);
                console.log('contactData.activity', $scope.contactData.activity)
                //$scope.contactData.notes[year][month][nKey];
                //$scope.contactData.notes[year][month][nKey].comments.splice(cKey,1);
                $http({
                    url: BASE_URL + "/contact/note/delete",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'nid=' + note_id
                }).then(function (response) {
                    var data = response.data;
                    if (data.status == true) {
                        console.log('note deleted');
                        swal("Deleted!", "Note deleted successfully.", "success");
                    } else {
                        //alert message
                        console.log(data.msg);
                    }
                });
            });
        }

        $scope.getNotes = (contact_id) => {
            $http({
                url: BASE_URL + "/contact/notes/" + contact_id,
            }).then(function (response) {
                console.log('getNotes response=', response.data);
                //$scope.contactData.activity[year][month].notes.data
                $scope.contactData.notes = response.data;
            });
        }

        $scope.commentText = [];
        $scope.addComment = (nKey, month, year, note_id) => {

            console.log('note_id', note_id);
            console.log('comments', $scope.commentText[note_id]);

            var postData = {
                'nid': note_id,
                'comment': $scope.commentText[note_id]
            };
            $scope.commentText[note_id] = "";

            $http({
                url: BASE_URL + "/note/comment/add",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param(postData)
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    //$scope.noteForm = {};
                    $scope.getNoteComments(nKey, month, year, note_id);
                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }

        $scope.getNoteComments = (nKey, month, year, note_id) => {
            if ($scope.contactData.id == undefined) {
                alert('Invalid contact');
                return false;
            }
            $http({
                url: BASE_URL + "/note/comments/" + note_id,
            }).then(function (response) {
                // $scope.contactData.notes = response.data;
                console.log('response.data', response.data);
                //$scope.contactData.notes[year][month][nKey].comments = response.data;
                $scope.contactData.activity[year][month]['notes']['data'][nKey].comments = response.data;
                //$scope.noteData.comments.response.data
                // console.log('notes', response.data);
            });
        }

        $scope.deleteComment = (cKey, nKey, month, year, comment_id) => {

            swal({
                title: "Are you sure you want to delete the Comment?",
                //text: "Are you sure you want to delete the Comment. ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {

                //$scope.contactData.notes[year][month][nKey].comments.splice(cKey, 1);
                $scope.contactData.activity[year][month]['notes']['data'][nKey].comments.splice(cKey, 1);

                $http({
                    url: BASE_URL + "/note/comment/delete",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'cid=' + comment_id
                }).then(function (response) {
                    var data = response.data;
                    if (data.status == true) {
                        console.log(data.msg);
                        swal("Deleted!", "Comment deleted successfully.", "success");
                    } else {
                        console.log(data.msg);
                    }
                });
            });


        }

        $scope.getContact = () => {
            //$scope.initNote();
            var param1 = $routeParams.param1;
            $http({
                url: BASE_URL + "/contact/" + param1,
            }).then(function (response) {
                console.log('response', response.data);
                $scope.contactData = response.data;
                showLoader(false);
                $scope.initNote();
            });
        }

        //Chat Bot Start

        $scope.contactLoad = false;
        $scope.initChatBot = () => {
            $scope.param = $routeParams.param1;
            console.log('initChatBot');
            $scope.runLoader = false;
            $scope.searchContactForm.type = 'chat';

            $scope.getContactMessages();
            $scope.getContacts();

            angular.element(document.querySelector('.contact-list-ui')).bind('scroll', function (e) {
                // var raw = e[0];
                var raw = angular.element(document.querySelector('.contact-list-ui'))[0];
                //console.log('e',e);
                tmpObj = raw;
                // console.log('height',angular.element(document.querySelector('.contact-list-ui'))[0].offsetHeight );
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 300 && $scope.contactLoad == false) {
                    $scope.contactLoad = true;
                    $scope.currentPage = $scope.currentPage + 1;
                    $scope.getContacts();
                }
            });

            setInterval(() => { $scope.getContactMessages() }, 10 * 1000);
        }

        $scope.searchChatContact = () => {
            $scope.currentPage = 1;
            console.log('searchChatContact', $scope.searchContactForm);
            var searchStr = $scope.searchContactForm.chatSearch;
            if (searchStr == "") {
                $scope.getContacts();
            }
            else if (searchStr.length > 2) {
                $scope.getContacts();
            }
        }

        $scope.scrollBottomChat = () => {
            // $location.hash('body');
            // $location.hash('chat-history');
            // $anchorScroll();
            //angular.element(document.querySelector(".chat-history"));
            // console.log('ui h1',angular.element(document.querySelector(".chat-history")).height() );
            // console.log('ui h2 ',angular.element(document.querySelector('.chat-history'))[0].offsetHeight)
            $timeout(function () {
                //var uiHeight = angular.element(document.querySelector('.chat-history'))[0].offsetHeight;
                var uiHeight = document.querySelector('.chat-history ul').offsetHeight;
                angular.element(document.querySelector('.chat-history'))[0].scrollTop = uiHeight;
                //console.log('finished---', uiHeight);
            }, 0);

        }

        $scope.scrollBottomFlag = 0;
        $scope.getContactMessages = () => {

            console.log('scrollBottomFlag', $scope.scrollBottomFlag);

            var contact_id = $routeParams.param1;
            $http({
                url: BASE_URL + "/contact/chat/" + contact_id,
            }).then(function (response) {
                // console.log('response', response);
                $scope.contactMessages = response.data;

                if ($scope.runLoader == false && $scope.contactMessages.messages) {
                    console.log('msg length', $scope.contactMessages.messages.length);
                    if ($scope.scrollBottomFlag != $scope.contactMessages.messages.length) {
                        console.log('scroll bottom');
                        $scope.scrollBottomFlag = $scope.contactMessages.messages.length;
                        $scope.scrollBottomChat();
                    }
                }

                showLoader(false);
            });
        }
        $scope.sendMsg = () => {

            console.log('contact', $scope.contactMessages);

            let postData = {
                'cid': $routeParams.param1,
                'rid': $scope.contactMessages.sender_id,
                'pid': $scope.contactMessages.page_id,
                'msg': $scope.new_msg
            }

            $scope.new_msg = "";

            $http({
                url: BASE_URL + "/contact/chat",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param(postData)
            }).then(function (response) {

                if (response.data.status == true) {

                    if ($scope.contactMessages.messages) {
                        l_msg = {};
                        l_msg.message = postData.msg;
                        l_msg.is_user_msg = 1;
                        l_msg.msg_date = new Date();
                        $scope.contactMessages.messages.push(l_msg);
                        $scope.scrollBottomChat();
                    }
                } else {
                    alert(response.data.msg);
                }
                showLoader(false);
            });
        }
        $scope.chatLoader = 1;
        $scope.loadPreviousChat = () => {

            console.log('loadPreviousChat');
            var postData = {
                'tid': $scope.contactMessages.thread_id,
                'pid': $scope.contactMessages.page_id,
            };

            $http({
                url: BASE_URL + "/contact/chat/previous",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param(postData)
            }).then(function (response) {
                $scope.previousChat = response.data;
                $scope.chatLoader = 0;
            });
        }

        $scope.data_sync = "0";
        $scope.syncAdAccount = () => {
            $scope.data_sync = "1";
            $http({
                //url: BASE_URL + "/ads/leads",
                url: BASE_URL + "/ads/sync_leads",
            }).then(function (response) {
                var data = response.data;
                if (data.status == 'completed') {
                    $scope.data_sync = "2";
                    $scope.getContacts();
                } else {
                    $scope.data_sync = "0";
                }
            });
        }
        $scope.contactForm = {};
        $scope.selectAllContacts = () => {
            var tmp = {};
            var key = 0;
            for (index in $scope.contactsData.contacts) {
                key = $scope.contactsData.contacts[index].id;
                if ($scope.contactForm.selectAll == undefined)
                    tmp[key] = true;
                else if ($scope.contactForm.selectAll == true)
                    tmp[key] = false;
                else
                    tmp[key] = true;

            }
            $scope.contactForm.contacts = tmp;
        }

        $scope.deleteContacts = () => {
            $http({
                url: BASE_URL + "/contacts/delete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.contactForm)
            }).then(function (response) {
                if (response.data.status == true) {
                    // $scope.contactForm.contacts = {};
                    $scope.getContacts();
                } else {
                    alert(response.data.msg);
                }
                showLoader(false);
            });
        }

        $scope.searchContactForm = {};
        $scope.searchContactForm.sorting = {};
        $scope.searchContactForm.sorting['date'] = 'desc';

        $scope.sortContacts = (colName, order = 'asc') => {
            if ($scope.searchContactForm.sorting[colName] != undefined) {
                order = $scope.searchContactForm.sorting[colName] == 'asc' ? 'desc' : 'asc';
            }
            $scope.searchContactForm.sorting = {};
            $scope.searchContactForm.sorting[colName] = order;
            $scope.getContacts();
        }

        $scope.showAllContacts = () => {
            $scope.searchContactForm = {};
            $scope.searchContactForm.sorting = {};
            $scope.searchContactForm.sorting['date'] = 'desc';
            $scope.getContacts();
        }

        $scope.getContacts = () => {

            showLoader($scope.runLoader);

            let pagingData = { page: $scope.currentPage, limit: $scope.itemsPerPage };
            $http({
                url: BASE_URL + "/contacts",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.searchContactForm) + '&' + jQuery.param(pagingData)
            }).then(function (response) {
                if ($scope.contactLoad == true) {
                    console.log('load contacts');
                    $scope.contactLoad = false;
                    $scope.contactsData.contacts = [...$scope.contactsData.contacts, ...response.data.contacts];
                } else {
                    $scope.contactForm.contacts = {};
                    $scope.contactsData = response.data;
                    $scope.initPagination(response.data.pagination);
                    showLoader(false);
                    $scope.contactForm.selectAll = false;
                }
            });
        }

        $scope.nextContactsPage = (page) => {

            if (page > 5) {
                $scope.pagingStart = page - 5;
                $scope.pagingEnd = $scope.pagingStart + 10;
            } else {
                $scope.pagingStart = 1;
                $scope.pagingEnd = 10;
            }


            $scope.currentPage = page;
            $scope.getContacts();
        }
        $scope.currentPage = 1;
        $scope.itemsPerPage = 30;
        $scope.maxSize = 0;
        $scope.totalItems = 0;
        $scope.pagingStart = 1;
        $scope.pagingEnd = 10;
        $scope.initPagination = (pageData) => {
            console.log('pageData', pageData);
            if (pageData.total != undefined) {
                $scope.totalItems = parseInt(pageData.total);
                $scope.maxSize = Math.ceil($scope.totalItems / $scope.itemsPerPage);
            } else {
                $scope.totalItems = 0;
            }
        }

        $scope.dateFormat = (date, format = null) => {

            if (format == null) format = 'd MMM yy HH:mm';

            formatDate = $filter('date')(new Date(date), format);

            return formatDate;
        }
    })
    .filter("reverse", function () {
        return function (items) {
            console.log('items', items);
            return items.slice().reverse(); // Create a copy of the array and reverse the order of the items
        };
    })
    .filter('orderObjectBy', function () {
        return function (input, attribute) {
            if (!angular.isObject(input)) return input;

            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function (a, b) {
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            });
            return array;
        }
    })
    .directive('showContactTab', function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.preventDefault();
                    jQuery(element).tab('show');
                });
            }
        };
    })
    .controller("mainController", function ($scope) {
        $scope.title = "Main Dashboard";
        console.log('mainController');

        $scope.stats = {};
        $scope.stats.visitors = 1550;
        $scope.stats.visits = 333;
        $scope.stats.chats = 13;
        showLoader(false);
    })
    .controller("leftNavController", function ($scope, $http, $rootScope, $location, dateService) {
        console.log('leftNavController');
    })
    .controller("navController", function ($scope, $http, $rootScope, $location, dateService) {
        $scope.title = "Nav Bar";
        console.log('navController');
    })
    .controller("hrController", function ($scope, dateService) {
        $scope.title = "HR Dashboard";
    })
//angular.module('filters', [])

function showLoader(show) {
    if (show == true) {
        $('.page-loader-wrapper').show();
    } else {
        $('.page-loader-wrapper').hide();
    }
}

function loadFunnalChart(data) {
    console.log('load chart', data);
    Highcharts.chart('container', {
        chart: {
            type: 'funnel'
        },
        title: {
            text: 'Leads funnel'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    softConnector: true
                },
                center: ['40%', '50%'],
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Unique Leads',
            data: data
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                inside: true
                            },
                            center: ['50%', '50%'],
                            width: '100%'
                        }
                    }
                }
            }]
        }
    });
}
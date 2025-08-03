var tmpObj;
var leadScope = null;
var chatInterval = null;

var CRMAPP = angular.module("crmApp", ["ngRoute", "ngSanitize"])
    .run(function ($rootScope, $http, $location) {
        console.log('angular run');
        $rootScope.getUserPages = () => {
            $http.get(BASE_URL + '/user/pages').then(function (response) {
                $rootScope.userPages = response.data;
            });
        };
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
    .controller("mailController", function ($scope, $sce, $http, $location, $routeParams, $filter) {

        $scope.getMails = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/mails",
            }).then(function (response) {
                $scope.mails_data = response.data;
            });
        }
        $scope.viewMail = (mail) => {
            $location.path('/mail/view/' + mail.thread_id);
        }

        $scope.getMail = (id = null) => {
            if (id == null) {
                id = $routeParams.id;
            }
            if (id == null) {
                alert('invalid mail id'); return false;
            }
            $http({
                url: BASE_URL + "/mail/" + id,
            }).then(function (response) {
                $scope.mail_data = response.data;
            });
        }
        $scope.deliberatelyTrustDangerousSnippet = function (data) {
            return $sce.trustAsHtml(data);
        };

        $scope.mailForm = {};
        $scope.composeAction = 0;
        $scope.mailCompose = (action, mailIndex) => {

            $scope.composeAction = action;

            console.log('mail_data', $scope.mail_data.data);

            var mailData = $scope.mail_data.data[mailIndex - 1];
            console.log('mailData', mailData);

            $scope.mailForm.mail_to = mailData.from_mail_id;

            if (action == 3) {
                $scope.mailForm.mail_cc = mailData.mail_cc;
                $scope.mailForm.mail_bcc = mailData.mail_bcc;
            }
        }
        $scope.cancelMail = () => {
            $scope.mailForm = {};
            $scope.composeAction = 0;
        }
        // && isReplyAll(mail_data.data)

        $scope.sendMail = () => {

            if ($scope.composeAction > 1) {
                $scope.mailForm.subject = $scope.mail_data.subject;
                $scope.mailForm.thread_id = $routeParams.id;
            }
            if ($scope.mailForm.mail_to == "" || $scope.mailForm.subject == "" || $scope.mailForm.mail_textarea == "") {
                swal("", "Please enter required fields.", "warning"); return false;
            }

            let token = $("input:hidden[name='token']").val();

            $http({
                url: BASE_URL + "/mail/send",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.mailForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.mailForm = {};
                    $scope.composeAction = 0;
                    $location.path('/mails');
                } else {
                    //alert message
                    console.log('error sending mail ');
                    swal("", data.msg, "warning");
                }
            });

        }

        $scope.thread_id = 0;
        $scope.checkThread = (mail) => {
            if ($scope.thread_id == mail.thread_id) {
                return false;
            } else {
                $scope.thread_id = mail.thread_id;
            }
            return true;
        }

        $scope.dateFormat = (date, format = null) => {

            if (format == null) format = 'd MMM yy HH:mm';

            formatDate = $filter('date')(new Date(date), format);

            return formatDate;
        }
    })
    .controller("permissionRoleController", function ($scope, $http, $location, $routeParams) {

        $scope.getPermissionRole = () => {
            if ($routeParams.param1 == null || $routeParams.param1 == "") {
                alert('Invalid Edit');
                $location.path('/permission_roles');
                return;
            }
            $scope.getPermissionModules();
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/permission_role/" + $routeParams.param1,
                // url: BASE_URL + "/permission_role/"+role_id,
            }).then(function (response) {
                $scope.permissionRoleForm = response.data.permission_role;
            });
        }
        $scope.getPermissionRoles = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/permission_roles",
            }).then(function (response) {
                $scope.permission_roles_data = response.data;
            });
        }
        console.log('init permissionRoleForm');
        $scope.permissionRoleForm = {
            readPermission: {},
            writePermission: {},
            deletePermission: {}
        };
        $scope.addPermissionRole = () => {
            console.log('permissionRoleForm', $scope.permissionRoleForm);

            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/permission_role/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.permissionRoleForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                alert(data.msg);
                if (data.status == true) {
                    $scope.permissionRoleForm = {};
                    //$scope.getPermissionRoles();
                    $location.path('/permission_roles');
                } else {
                    //alert message
                    console.log('error creating permission role');
                    swal("", data.msg, "warning");
                }
            });
        }

        // $scope.editPermissionRoleForm = {};
        $scope.savePermissionRole = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/permission_role/update",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.permissionRoleForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    alert(data.msg);
                    $location.path('/permission_roles');
                } else {
                    //alert message
                    console.log('error saving permission role');
                    swal("", data.msg, "warning");
                }
            });
        }

        $scope.changePermissionRoleStatus = (role) => {
            console.log('changePermissionRoleStatus', role);
            let token = $("input:hidden[name='token']").val();
            let status = role.status == 1 ? 0 : 1;
            $http({
                url: BASE_URL + "/permission_role/chnage_status",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: "r_id=" + role.id + "&status=" + status + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.getPermissionRoles();
                    alert(data.msg);
                } else {
                    //alert message
                    console.log('error saving permission role');
                }
            });
        }

        $scope.getPermissionModules = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/permission_modules",
            }).then(function (response) {
                $scope.permission_modules = response.data.permission_modules;
            });
        }

        $scope.selectedRoles = {};

        $scope.getSelectedRole = (role_id, title = null) => {

            console.log('permissionRoleController::getSelectedRole')
            let permission_roles = $scope.permission_roles_data.permission_roles;
            for (k in permission_roles) {
                if (role_id == permission_roles[k].id) {
                    $scope.selectedRoles = permission_roles[k].permission_modules;
                    console.log('selectedRoles', $scope.selectedRoles)
                }
            }
            $scope.selectedRoles.title = title;
        }

        $scope.changeWritePermission = (id, action = '') => {
            console.log('changeWritePermission', $scope.permissionRoleForm);
            if (action == 'edit')
                $scope.permissionRoleForm.permission_modules.readPermission[id] = $scope.permissionRoleForm.permission_modules.writePermission[id];
            else
                $scope.permissionRoleForm.readPermission[id] = $scope.permissionRoleForm.writePermission[id];

        }
        $scope.changeDeletePermission = (id, action = '') => {
            if (action == 'edit') {
                $scope.permissionRoleForm.permission_modules.readPermission[id] = $scope.permissionRoleForm.permission_modules.deletePermission[id];
                $scope.permissionRoleForm.permission_modules.writePermission[id] = $scope.permissionRoleForm.permission_modules.deletePermission[id];
            } else {
                $scope.permissionRoleForm.readPermission[id] = $scope.permissionRoleForm.deletePermission[id];
                $scope.permissionRoleForm.writePermission[id] = $scope.permissionRoleForm.deletePermission[id];
            }

        }

    })
    .controller("teamController", function ($scope, $http, $location, $routeParams) {
        console.log('teamController');
        $scope.DEPARTMENTS = [];
        $scope.showEditTeamRole = (el, team_role) => {
            console.log('showEditTeamRole', team_role);
            $scope.editPermissionRoleForm[team_role.id] = team_role;

            angular.element(document.querySelectorAll(".team-role-title-" + team_role.id)).addClass('hidden');
            angular.element(document.querySelectorAll(".team-role-title-" + team_role.id)).removeClass('btnDiv');

            angular.element(el.target).parent().parent().addClass('showTeamRole');

        }
        $scope.hideEditDepartment = () => {
            angular.element(document.querySelectorAll(".role_list li")).removeClass("showTeamRole");
            angular.element(document.querySelectorAll(".dd-handle")).removeClass('hidden');

            angular.element(document.querySelectorAll(".editBtnDiv")).addClass('btnDiv');
            angular.element(document.querySelectorAll(".editBtnDiv")).removeClass('hidden');
        }

        //Department Functions
        // $scope.getLeadDepartment = () => {
        //     let token = $("input:hidden[name='token']").val();
        //     $http({
        //         url: BASE_URL + "/department",
        //     }).then(function (response) {
        //         $scope.leadSources = response.data;
        //     });
        // }
        $scope.getDepartments = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/departments",
            }).then(function (response) {
                $scope.departmentsData = response.data;
            });
        }
        $scope.departmentForm = {};
        $scope.addDepartment = () => {
            console.log('add departmentForm', $scope.departmentForm);
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/department/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.departmentForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                if (data.status == true) {
                    $scope.departmentForm = {};
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

        //Team Functions
        $scope.initTeam = () => {
            console.log('initTeam');
            $scope.getDepartments();
            $scope.getPermissionRoles();
            $scope.getPermissionModules();
            $scope.getTeams();
        }
        $scope.getPermissionRoles = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/permission_roles",
            }).then(function (response) {
                $scope.permission_roles_data = response.data;
                console.log('getPermissionRoles');
            });
        }
        $scope.getPermissionModules = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/permission_modules",
            }).then(function (response) {
                $scope.permission_modules = response.data.permission_modules;
                // console.log('getPermissionModules');
            });
        }
        $scope.selectedRoles = {};
        $scope.getSelectedRole = (role_id) => {
            console.log('role_id', role_id)
            console.log('getSelectedRole')
            if ($scope.permission_roles_data) {
                let permission_roles = $scope.permission_roles_data.permission_roles;
                for (k in permission_roles) {
                    console.log('role_id', role_id + "=" + permission_roles[k].id)
                    if (role_id == permission_roles[k].id) {
                        $scope.selectedRoles = permission_roles[k].permission_modules;
                        console.log('selectedRoles', $scope.selectedRoles)
                    }
                }
            }
        }

        $scope.getTeams = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/teams",
            }).then(function (response) {
                $scope.teams_data = response.data;
            });
        }
        $scope.createTeam = () => {

            let token = $("input:hidden[name='token']").val();

            $http({
                url: BASE_URL + "/team/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.teamForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                alert(data.msg);
                if (data.status == true) {
                    $scope.teamForm = {};
                    //append data
                    //$scope.getTeams();
                    $scope.selectedRoles = {};

                    $location.path('/teams');

                } else {
                    //alert message
                    console.log('error creating team');
                }
            });

        }
        $scope.saveTeam = () => {
            let token = $("input:hidden[name='token']").val();

            $http({
                url: BASE_URL + "/team/update",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.teamForm) + "&token=" + token
            }).then(function (response) {
                data = response.data;
                alert(data.msg);
                if (data.status == true) {
                    $scope.teamForm = {};
                    //append data
                    //$scope.getTeams();
                    $scope.selectedRoles = {};

                    $location.path('/teams');

                } else {
                    //alert message
                    console.log('error creating team');
                }
            });
        }
        $scope.viewTeamDetails = (team_id) => {
            console.log('viewTeamDetails');
            $location.path('/team/view/' + team_id);
        }
        $scope.getTeamDetails = () => {
            if ($routeParams.param1 == null || $routeParams.param1 == "") {
                alert('Invalid team view');
                $location.path('/teams');
                return;
            }

            $scope.getDepartments();
            $scope.getPermissionRoles();

            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/team/" + $routeParams.param1,
            }).then(function (response) {
                // $scope.teamData = response.data;
                $scope.teamForm = response.data.team_details;
                $scope.getSelectedRole($scope.teamForm.role_id);
            });
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
                    $location.path('/mycontacts');
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
                if (response.data.status == false) {
                    alert(response.data.msg);
                    $location.path('/');
                } else {
                    $scope.leadSources = response.data;
                }
            });
        }
        $scope.leadSourceForm = {};
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
                    swal("", data.msg, "warning");
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
                    swal("", data.msg, "warning");
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
                // if (data.lead_stages != undefined)
                $scope.lead_stages_data = data;

                if (data.cData != undefined)
                    loadFunnalChart(data.cData);


                setTimeout(function () {
                    initStageQuery();
                }, 1000);
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
                    console.log('error create addStage');
                    swal("", data.msg, "warning");
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
                    console.log('error saving addStage');
                    swal("", data.msg, "warning");
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
                    swal("", data.msg, "warning");
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
    .controller("contactController", function ($rootScope, $scope, $http, $anchorScroll, $location, $timeout, $filter, $routeParams) {

        console.log('contactController');
        console.log('chatInterval',chatInterval);

        $scope.runLoader = true;

        if (!$rootScope.userPages) {
            $rootScope.getUserPages();
        }


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

        //Deal Functions
        $scope.dealForm = {};
        $scope.createDeal = () => {
            if ($scope.contactData.id == undefined) {
                alert('Invalid contact note');
                return false;
            }
            console.log('createDeal', $scope.dealForm)

            $scope.dealForm.cid = $scope.contactData.id;

            $scope.dealForm.repeat_on = $scope.dayOfWeek;
            console.log('dealForm.repeat_on', $scope.dealForm.repeat_on);
            //$scope.dayOfWeek = [];

            //angular.element(document.querySelector('.addNote')).hide();
            $http({
                url: BASE_URL + "/deal/create",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param($scope.dealForm)
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    $scope.dealForm = {};

                    $scope.contactData.activity_length = 1;
                    $('.hideCreateNote').trigger('click');
                    $scope.initNote();

                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }
        $scope.getDeals = (contact_id) => {
            $http({
                url: BASE_URL + "/deals/" + contact_id,
            }).then(function (response) {
                console.log('response.data', response.data);
                let tasksActivity = response.data;

                for (nYear in tasksActivity) {
                    for (nMonth in tasksActivity[nYear]) {
                        console.log('year,month', tasksActivity[nYear][nMonth]);
                        $scope.contactData.activity[nYear][nMonth].tasks.data = tasksActivity[nYear][nMonth];
                        console.log('activity', $scope.contactData.activity)
                    }
                }
                // $scope.contactData.tasks = response.data;
            });
        }

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
                url: BASE_URL + "/mycontact/task/create",
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
                                                    console.log('task append');
                                                    if (!$scope.contactData.activity[year][month].tasks) {
                                                        $scope.contactData.activity[year][month].tasks = { 'data': [] };
                                                    }
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
                    $scope.contactData.activity_length = 1;
                    $('.hideCreateNote').trigger('click');
                    $scope.initNote();

                } else {
                    //alert message
                    console.log(data.msg);
                }
            });
        }
        $scope.getTasks = (contact_id) => {
            $http({
                url: BASE_URL + "/mycontact/tasks/" + contact_id,
            }).then(function (response) {
                console.log('response.data', response.data);
                let tasksActivity = response.data;

                for (nYear in tasksActivity) {
                    for (nMonth in tasksActivity[nYear]) {
                        console.log('year,month', tasksActivity[nYear][nMonth]);
                        $scope.contactData.activity[nYear][nMonth].tasks.data = tasksActivity[nYear][nMonth];
                        console.log('activity', $scope.contactData.activity)
                    }
                }
                // $scope.contactData.tasks = response.data;
            });
        }

        $scope.showEditTask = [];
        $scope.editTask = [];
        $scope.setTaskData = (task_id, tKey, month, year) => {
            console.log('setTaskData', task_id)

            // angular.element(document.querySelector(e)).removeClass("hidden");
            // var target = angular.element(el.target).parent();
            // var target = el.target;

            // console.log('target',angular.element(target).hasClass('task-block'))

            // angular.element(el.target).parent().addClass('showTeamRole');

            // if ($scope.showEditTask[task_id] != undefined && $scope.showEditTask[task_id] == true)
            //     $scope.showEditTask[task_id] = false;
            // else
            //     $scope.showEditTask[task_id] = true;

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
                url: BASE_URL + "/mycontact/task/edit",
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

        $scope.confirmTask = {};
        $scope.confrimDeleteTask = (task, tKey, month, year) => {

            //if ($scope.contactData.tasks[year][month][tKey].set_to_repeat == "0") {
            console.log('task', $scope.contactData.activity[year][month].tasks.data[tKey]);

            $scope.confirmTask = {
                task: task,
                year: year,
                month: month,
                tKey: tKey
            };

            if ($scope.contactData.activity[year][month].tasks.data[tKey].set_to_repeat == "0") {
                //Confirm for Single Task
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
                    $scope.deleteTask($scope.confirmTask);
                });
            } else {
                //Confirm popup box for multi Task
                $scope.delete_repeat_task = 'this'; //Set by default this option for pupup box
                $('.popupBg, .popupBody').fadeIn();
            }
        }
        $scope.deleteTask = (confirmTask) => {

            if (!confirmTask) return false;
            $('.popupBg, .popupBody').fadeOut();
            let task = confirmTask.task;
            $http({
                url: BASE_URL + "/mycontact/task/delete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'tid=' + task.id + "&pid=" + task.parent_id + "&action=" + $scope.delete_repeat_task
            }).then(function (response) {
                var data = response.data;
                if (data.status == true) {
                    console.log('task deleted');
                    swal("Deleted!", "Task deleted successfully.", "success");

                    $scope.contactData.activity[confirmTask.year][confirmTask.month].tasks.data.splice(confirmTask.tKey, 1);

                    if ($scope.delete_repeat_task != 'this') {
                        console.log('reload after deleted=', $scope.delete_repeat_task);
                        $scope.getTasks($scope.contactData.id);
                    }
                    $scope.delete_repeat_task = "";
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

        $scope.deleteTaskComment = (cKey, tKey, month, year, comment_id) => {
            swal({
                title: "Are you sure you want to delete the Comment?",
                //text: "Are you sure you want to delete the Comment. ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {

                $scope.contactData.tasks[year][month][tKey].comments.splice(cKey, 1);
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
                        console.log(data.msg);
                        swal("Deleted!", "Comment deleted successfully.", "success");
                    } else {
                        console.log(data.msg);
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
                url: BASE_URL + "/mycontact/note/create",
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
                url: BASE_URL + "/mycontact/note/edit",
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
                    url: BASE_URL + "/mycontact/note/delete",
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
                url: BASE_URL + "/mycontact/notes/" + contact_id,
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

        //Get Contact Details
        $scope.getContact = () => {
            //$scope.initNote();
            var param1 = $routeParams.param1;
            $http({
                url: BASE_URL + "/mycontact/" + param1,
            }).then(function (response) {
                console.log('response', response.data);
                $scope.contactData = response.data;
                showLoader(false);
                $scope.initNote();
                $scope.getTeams();
            });
        }
        $scope.getTeams = () => {
            let token = $("input:hidden[name='token']").val();
            $http({
                url: BASE_URL + "/teams",
            }).then(function (response) {
                $scope.teams_data = response.data;
            });
        }

        //Chat Bot Start
        $scope.chatPath = null;
        $scope.contactLoad = false;
        $scope.initChatBot = () => {
            $scope.param = $routeParams.param1;
            console.log('initChatBot');
            $scope.runLoader = false;
            $scope.lastMsgID = null;
            $scope.searchContactForm.type = 'chat';
            $scope.chatPath = $location.path();
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

            //setInterval(() => { $scope.getContactMessages() }, 10 * 1000);
            // chatInterval =  setInterval(() => { console.log('fetch chat message') }, 10 * 1000);
            chatInterval = setInterval(() => { $scope.fetchLastMessages() }, 10 * 1000);
        }
        $scope.fetchLastMessages = ()=>{

            // console.log('chatPath',$scope.chatPath);
            if($scope.chatPath!=$location.path()){
                clearInterval(chatInterval);
            }
            $scope.getLastMessages();
            
        }
        

        $scope.searchChatContact = () => {
            $scope.currentPage = 1;
            // console.log('searchChatContact', $scope.searchContactForm);
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
        $scope.msg_limit_reached = 1;
        $scope.msgLimitReachedShow = () => {
            $scope.msg_limit_reached = 0;
        }
        $scope.lastMsgID = null;
        $scope.scrollBottomFlag = 0;
        $scope.getContactMessages = () => {

            console.log('getContactMessages');
            console.log('scrollBottomFlag', $scope.scrollBottomFlag);

            var contact_id = $routeParams.param1;
            $http({
                url: BASE_URL + "/mycontact/mychat/" + contact_id,
            }).then(function (response) {
                // console.log('response', response);
                $scope.contactMessages = response.data;

                if ($scope.runLoader == false && $scope.contactMessages.messages) {
                    let msgLength = $scope.contactMessages.messages.length;
                    // console.log('msgLength',msgLength);
                    $scope.lastMsgID = $scope.contactMessages.messages[msgLength-1].id;
                    // console.log('lastMsgID', $scope.lastMsgID);
                    if ($scope.scrollBottomFlag != msgLength) {
                        // console.log('scroll bottom');
                        $scope.scrollBottomFlag = msgLength;
                        $scope.scrollBottomChat();
                    }
                }
                if(chatInterval==null){
                    chatInterval = setInterval(() => { $scope.fetchLastMessages() }, 10 * 1000);
                }
                showLoader(false);
            });
        }
        $scope.getLastMessages = ()=>{

            if($scope.lastMsgID!=null){

                $http({
                    url: BASE_URL + "/mycontact/messages/"+$routeParams.param1,
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'last_msg_id='+$scope.lastMsgID
                }).then(function (response) {
                    if (response.data.status == true) {
                        let msgs = response.data.msgs;
                        if ($scope.contactMessages.messages && msgs) {
                            for(k in msgs){
                                console.log('push msg',$scope.contactMessages.messages.length);
                                $scope.contactMessages.messages.push(msgs[k]);
                                $scope.lastMsgID = msgs[k].id;
                                // console.log('=lastMsgID=',$scope.lastMsgID);
                            }
                            
                            $scope.scrollBottomChat();
                        }
                    } 
                    showLoader(false);
                });

            }
        }

        $scope.new_msg = "";
        $scope.sendMsg = () => {

            console.log('msg', $scope.new_msg);

            if ($scope.contactMessages.last_date > 7) {
                swal("Message can't send!", `${$scope.contactMessages.full_name} hasn't responded in over 7 days. Once ${$scope.contactMessages.full_name} sends another message you will be able to respond.`, "warning");
                return false;
            }
            if ($scope.new_msg == "") {
                swal("No Message!", "Message should be enter.", "warning");
                return false;
            }

            let postData = {
                'cid': $routeParams.param1,
                'rid': $scope.contactMessages.sender_id,
                'pid': $scope.contactMessages.page_id,
                'msg': $scope.new_msg
            }
            console.log('postData', postData)

            $scope.new_msg = "";

            $http({
                url: BASE_URL + "/mycontact/mychat",
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
                        l_msg.status = 0;
                        $scope.contactMessages.messages.push(l_msg);
                        $scope.scrollBottomChat();
                        
                        $scope.lastMsgID = response.data.msg;

                        //$scope.getContactMessages();
                    }
                    $scope.sendFBMsg(response.data.msg);
                } else {
                    // alert(response.data.msg);
                    swal("Message can't send!", response.data.msg, "warning");
                }
                showLoader(false);
            });
        }
        $scope.sendFBMsg = (id)=>{
            console.log('sending msg to fb user from page user');
            $http({
                url: BASE_URL + "/mycontact/fbchat/" + id,
            }).then(function (response) {
                if (response.data.status == true) {
                    clearInterval(chatInterval);
                    chatInterval = null;
                    $scope.getContactMessages();
                    // $scope.getLastMessages();
                }
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
                url: BASE_URL + "/mycontact/chat/previous",
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
                url: BASE_URL + "/mycontacts/delete",
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
            $scope.searchContactForm.selectPage = 'all';
            $scope.searchContactForm.sorting = {};
            $scope.searchContactForm.sorting['date'] = 'desc';
            $scope.resetPaging();
            $scope.getContacts();
        }

        $scope.getContacts = () => {

            showLoader($scope.runLoader);

            let pagingData = { page: $scope.currentPage, limit: $scope.itemsPerPage };
            $http({
                url: BASE_URL + "/mycontacts",
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

        $scope.showContact = (contact) =>{
            console.log('contact',contact);
            console.log('userpages',$rootScope.userPages);
            // href="#!/mycontact/details/{{contact.id}}"
            for(key in $rootScope.userPages){
                console.log('page=',$rootScope.userPages[key]);
                if($rootScope.userPages[key].page_id == contact.page_id){
                    if($rootScope.userPages[key].status == 1){
                        $location.path('/contact/details/'+contact.id);
                    }else{
                        swal("", "You can not access this contact.", "warning"); return false;
                    }
                }
            }
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

        $scope.resetPaging = () => {
            $scope.currentPage = 1;
            $scope.itemsPerPage = 30;
            $scope.maxSize = 0;
            $scope.totalItems = 0;
            $scope.pagingStart = 1;
            $scope.pagingEnd = 10;
        }
        $scope.resetPaging();
        $scope.initPagination = (pageData) => {
            // console.log('pageData', pageData);
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
    .filter('capitalizeWord', function () {
        return function (text) {
            //return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
            return (!!text) ? text.charAt(0).toUpperCase() : '';
        }
    })
    .filter('getDepartmentName', function () {
        return function (d_id, departments) {
            for (k in departments) {
                if (departments[k].id == d_id)
                    return departments[k].title;
            }
            return '- - -';
        }
    })
    .filter('getRoleName', function () {
        return function (r_id, roles) {
            for (k in roles) {
                if (roles[k].id == r_id)
                    return roles[k].title;
            }
            return '- - -';
        }
    })
    .filter('formatDate', function ($filter) {
        return function (date, format) {
            if (format == null) format = 'dd MMM yyyy HH:mm';
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
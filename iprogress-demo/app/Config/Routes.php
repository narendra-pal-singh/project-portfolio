<?php

namespace Config;

use App\Models\CitiesModel;
use App\Models\ClassModel;
use App\Models\CountryModel;
use App\Models\StatesModel;
use App\Models\SubjectModel;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (is_file(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);
/* The Auto Routing (Legacy) is very dangerous. It is easy to create vulnerable apps
 *  where controller filters or CSRF protection are bypassed.
 *  If you don't want to define all routes, please use the Auto Routing (Improved).
 *  Set `$autoRoutesImproved` to true in `app/Config/Feature.php` and set the following to true.
 *  $routes->setAutoRoute(false);
 */
/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */
/* We get a performance increase by specifying the default
 * route since we don't have to scan directories.
 */
$routes->group('masterapi', ['namespace' => 'App\Controllers\MasterApi'], function ($routes) {
    $routes->get('/', 'Auth::index');
    $routes->post('login', 'Auth::login');
    $routes->get('products', 'Product::get_products');
});
// Master API - Version 1
$routes->group('masterapi/v1', ['namespace' => 'App\Controllers\MasterApi\v1'], function ($routes) {
    $routes->get('/', 'Auth::index');
    $routes->post('login', 'Auth::login');
    $routes->get('products', 'Product::get_products');
});

// Master API - Version 2
$routes->group('masterapi/v2', ['namespace' => 'App\Controllers\MasterApi\v2'], function ($routes) {
    $routes->get('/', 'Auth::index');
    $routes->post('login', 'Auth::login');
    $routes->get('products', 'Product::get_products');
});
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function ($routes) {
    $routes->get('students', 'Student::index');
    $routes->post('students/create', 'Student::create');
    $routes->post('students/get_marks', 'Student::get_marks');
    $routes->post('student/insert_marks', 'Student::insert_marks');
    $routes->post('subject/insert', 'Subject::insert');
    $routes->post('student/insert_attendance', 'Student::insert_attendance');
    $routes->get('/', 'Auth::index');
    $routes->post('login', 'Auth::login');
    $routes->post('register', 'Auth::create');
    $routes->get('auth_login/(:any)', 'Auth::auth_login/$1');
    $routes->post('update', 'Auth::update_teacher');
});

$routes->get('/', 'Home::index');
$routes->get('/privacy-policy', function () {
    return view('privacypolicy/index');
});
$routes->get('/contact', function () {
    return view('contact/index');
});
$routes->get('/terms-conditions', function () {
    return view('terms-conditions/index');
});
$routes->group("home", function ($routes) {
    $routes->get("/", "home::index");
    $routes->add('subject', 'home::subject');
    $routes->add('designation', 'home::designation');
    $routes->add('country', 'home::country');
    $routes->add('board', 'home::board');
    $routes->add("stateById/(:num)", "home::stateById/$1");
    $routes->add("cityById/(:num)", "home::cityById/$1");
});
//ChatGPT Routes chatgpt
$routes->group('chatgpt', function ($routes) {
    $routes->get('/', 'Chat::index');
    $routes->get('questions', 'Chat::questions');
    $routes->get('get_qus_image/(:num)/(:any)', 'Chat::get_qus_image/$1/$2');
    $routes->get('get_aws_image/(:num)/(:any)', 'Chat::get_aws_image/$1/$2');
    $routes->get('import_image_form', 'Chat::import_image_form');
    $routes->post('import_csv', 'Chat::import_csv');
    $routes->post('get_questions_list', 'Chat::get_questions_list');
    $routes->match(['get', 'post'], 'form', 'Chat::form');
    $routes->get('list_questions/(:num)', 'Chat::list_questions/$1');
    $routes->get('list_questions', 'Chat::list_questions');
    $routes->match(['get', 'post'], 'get_questions', 'Chat::get_questions');
    $routes->post('import_file', 'Chat::import_file'); 
    $routes->post('import_image', 'Chat::import_image'); 
    $routes->post('import_images', 'Chat::import_images'); 
    $routes->post('verify_question', 'Chat::verify_question');
    $routes->match(['get', 'post'], 'generate_pdf', 'Chat::gen_pdf');
    $routes->match(['get', 'post'], 'gen_sim_qus', 'Chat::gen_sim_qus');
});

//Student Routes
$routes->group('student', function ($routes) {
    $routes->match(['get', 'post'], 'home_work', 'StudentController::home_work');
    $routes->match(['get', 'post'], 'home_work_list', 'StudentController::home_work_list');
    $routes->match(['get', 'post'], 'home_work_settings', 'StudentController::home_work_settings');
    $routes->match(['get', 'post'], 'add_homework_settings', 'StudentController::add_homework_settings');
    $routes->match(['get', 'post'], 'edit_homework_settings', 'StudentController::edit_homework_settings');
});


$routes->match(['get', 'post'], 'login', 'Home::login');
$routes->match(['get', 'post'], 'cms-login', 'Home::cms_login');


$routes->post('request-otp', 'Home::request_otp');
$routes->post('validate-otp', 'Home::validate_otp');
$routes->get('/profile/(:num)', 'Home::profile_otp_login/$1');
$routes->get('/parent-dashboard', 'Home::parent_dashboard');
$routes->get('logout', 'Home::logout');

$routes->group("/", function ($routes) {
    $routes->get("/dashboard", "Home::index");
});

$routes->group('Views', function ($routes) {
    $routes->add('/', 'UriController::index');
    $routes->add('/*(:any)*/*', 'UriController::index/*');
});

$routes->group('user', function ($routes) {
    $routes->get("/",                       "Home::userdata");
    $routes->get("role",                    "Home::roledata");
    $routes->add("create",                  "Home::create");
    $routes->add("add-role",                "Home::createRole");
    $routes->add("show-user/(:num)",        "Home::showUsers/$1");
    $routes->add("show-role/(:num)",        "Home::showRoles/$1");
    $routes->add("edit/(:num)",             "Home::edit/$1");
    $routes->add("user-status/(:num)",      "Home::user_change_status/$1");
    $routes->add("update-role",             "Home::updateRole");
    $routes->add("update",                  "Home::update");
    $routes->add("delete",                  "Home::delete");
    $routes->add("role-status/(:num)",      "Home::role_change_status/$1");
    $routes->post("change-password",         "Home::change_password");
    $routes->post("check-username",         "Home::check_username");
});

#########################################################################################################


if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
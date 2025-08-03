<?php

namespace App\Controllers;

use App\Models\ExamAIModel;
use App\Models\ClassModel;
use App\Models\BoardModel;
use App\Models\SubjectModel;
use App\Models\TopicModel;
use App\Models\UserModel;
use App\Models\SchoolModel;
use App\Models\StudentModel;
use App\Models\CoordinatorModel;
use App\Models\SectionModel;
use App\Libraries\AWS;
use PhpOffice\PhpSpreadsheet\Reader\Csv;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xls;
use \DateTime;
use \DateTimeZone;
use FPDF;
use Mpdf\Mpdf;

/**
 * ExamAI Controller
 *
 * Manages AI-driven exam workflows, including:
 * - Question operations: generation, editing, verification, publishing
 * - Paper operations: creation, editing, publishing
 * - Assessment operations: generation, practice assessments
 * - Exam operations: attempts, result reports
 */


class ExamAIController extends BaseController
{
    protected $qus_arr; // Stores questions parsed from the OpenAI JSON response
    protected $access;  //User access data (based on role).

    // Model instances
    protected $ExamAIModel;
    protected $ClassModel;
    protected $BoardModel;
    protected $SubjectModel;
    protected $TopicModel;
    protected $UserModel;
    protected $SchoolModel;
    protected $StudentModel;
    protected $CoordinatorModel;
    protected $SectionModel;
    protected $helpers = ['form', 'url', 'file', 'my_helper'];

    public function __construct()
    {
        $this->ExamAIModel = new ExamAIModel();
        $this->ClassModel = new ClassModel();
        $this->BoardModel = new BoardModel();
        $this->SubjectModel = new SubjectModel();
        $this->TopicModel = new TopicModel();
        $this->UserModel = new UserModel();
        $this->SchoolModel = new SchoolModel();
        $this->StudentModel = new StudentModel();
        $this->CoordinatorModel = new CoordinatorModel();
        $this->SectionModel = new SectionModel();
        //Fetch access data based on logged-in user's role
        $this->access = $this->UserModel->getUserAccess();
        // Initialize question array
        $this->qus_arr = [];
    }
    /**
     * Default route (for debugging).
     */
    public function index()
    {
        die('index');
    }
    /**
     * Prepares and stores a ChatGPT form request for question generation.
     *
     * @param array $post_data Form input data from the request.
     * @return string Form request ID (if inserted into the database).
     */
    private function chatgpt_form_req($post_data)
    {
        $user_id = session()->get('admin_id');
        $question_type = $post_data['question_type'] ?? [];
        // Default question type
        $qType = 'MCQ';
        if ($question_type) {
            // Keep only values explicitly set to 'true'
            // Example: [1 => 'true', 2 => 'true', 3 => 'false', 4 => 'true'] → [1, 2, 4]
            $question_type = array_filter($question_type, fn($v) => $v === 'true');
            $post_data['question_type'] = $question_type;
            //get key valuse from questoin type [1=>true, 2=>true,4=>true]
            $question_type = array_keys($question_type);
            // pd($question_type);
            $qType = ($question_type[0] == 1) ? 'MCQ' : 'Subjective';
            //convert keys value into json for store in table 
            $question_type = json_encode($question_type);
        }
        // Map difficulty level to descriptive text
        $difficultyMap = [
            1 => 'easy-difficulty',
            2 => 'medium-difficulty',
            3 => 'difficulty'
        ];
        $difficulty = $difficultyMap[$post_data['difficulty_level']] ?? 'very-difficulty';
        $subjective_type = $post_data['subjective_type'] ?? "";
        $class_name = $this->get_class_name($post_data['class_id']);
        $subject_name = $this->get_subject_name($post_data['subject_id']);
        $qus_num = $post_data['qus_num'] ?? null;
        $total_qus = $qus_num ? array_sum($qus_num) : 0;
        //Generate 5 very-difficult Multiple Choice Questions and very-long Subjective questions for Grade Grade 10 in Mathematics
        $prompt = "Generate $total_qus $difficulty $subjective_type and $qType questions for $class_name in $subject_name";
        $post_data['topics'] = array_values(array_filter($post_data['topics']));
        // Prepare data for database insertion
        $data = [
            'board_id'         => $post_data['board_id'],
            'class_id'         => $post_data['class_id'],
            'subject_id'       => $post_data['subject_id'],
            'question_types'   => $question_type,
            'subjective_type'  => $subjective_type,
            'difficulty_level' => $post_data['difficulty_level'] ?? 0,
            'topic_id'         => $post_data['topic'] ?? 0,
            'subtopic_id'      => $post_data['subtopic'] ?? 0,
            'num_qus'          => 0,
            'post_data'        => json_encode($post_data),
            'query_string'     => $prompt,
            'created_by'       => $user_id,
        ];
        $form_req_Id =  ''; //insert form request data
        return $form_req_Id;
    }
    public function form()
    {
        $data = [
            'board_id'   => '',
            'class_list' => json_encode([]), // Default empty class list
        ];

        $post_data = $this->request->getPost();

        if (!empty($post_data)) {
            // Check if paper bank ID is provided and replace $post_data with its generated data
            if (!empty($post_data['paper_bank_id'])) {
                $post_data = $this->gen_paper_bank_post($post_data['paper_bank_id']);
            }

            // Create ChatGPT form request
            $form_req_Id = $this->chatgpt_form_req($post_data);

            // Return JSON response based on request creation status
            return $this->response->setJSON(
                $form_req_Id
                    ? ['status' => true,  'form_req_Id' => $form_req_Id]
                    : ['status' => false, 'msg' => 'Unable to create request. Please try again later.']
            );
        }

        // If GET request: Load initial subject list
        $subject_list = $this->SubjectModel->subject_list(false, '1');
        $data['subject_list'] = json_encode($subject_list);

        // Clear previous query session
        session()->remove('query');

        // Render form view
        return view('templates/chat_gpt_form', $data);
    }
    private function gen_paper_bank_post($paper_bank_id)
    {
        $post_data = $this->request->getPost();
        //gen paper bank code remvoed from here
        return $post_data;
    }

    /**
     * Saves or updates a question along with its options and metadata.
     *
     * Handles both subjective and objective (MCQ) type questions.
     *
     * @return \CodeIgniter\HTTP\Response
     */
    public function save()
    {
        $post_data  = $this->request->getVar();
        $image_data = $post_data['image_data'] ?? null;

        // Initialize main question data
        $data = [
            'question'        => $post_data['q_title'] ?? '',
            'difficulty_level' => $post_data['difficulty_level'] ?? null,
            'marks'           => $post_data['marks'] ?? null,
            'descriptor'      => $post_data['descriptor'] ?? '',
            'explanation'     => $post_data['explanation'] ?? '',
            'reviewed_by'     => $this->user_id ?? null, // Ensure $this->user_id is set in controller
            'reviewed_date'   => date('Y-m-d H:i:s'),
            'edited'          => 1,
        ];

        // Attach question image if available
        if (!empty($image_data['qus_image'])) {
            $data['file_path'] = $image_data['qus_image'];
        }

        $options_data = [];

        // If 'ans_text' is provided → Subjective question
        if (!empty($post_data['ans_text'])) {
            $options_data[] = [
                'is_correct'   => 1,
                'option_text'  => $post_data['ans_text'],
            ];
        }
        // Otherwise → Objective question (MCQ)
        else {
            $options = $post_data['options'] ?? [];
            $answerIndex = $post_data['ans'] ?? null;

            foreach ($options as $key => $option) {
                $opt = [
                    'is_correct'  => ($answerIndex == ($key + 1)) ? 1 : 0,
                    'option_text' => $option['value'] ?? '',
                ];

                // Attach option image if available
                if ($image_data) {
                    $image_key = 'opt_' . $key . '_image';
                    if (!empty($image_data[$image_key])) {
                        $opt['file_path'] = $image_data[$image_key];
                    }
                }

                $options_data[] = $opt;
            }
        }
        // TODO: Save $data to questions table and $options_data to options table
        $updateRecord = $this->QuestionModel->update($questionId, $data);
        $this->QuestionModel->updateOptions($questionId, $options_data);
        return $this->response->setJSON([
            'status' => ($updateRecord > 0)
        ]);
    }

    private function find_report_questions($post_data, $user_classes, $type = 'list') {}
    private function find_questions($post_data, $user_classes, $type = 'list') {}
    public function get_questions_list() {}
    public function verify_question() {}
    public function delete_option() {}
    public function list_questions($req_id = null) {}
    private function get_question($id) {}
    public function get_questions() {}
    private function fetch_questions($post_data, $page_no = 0, $limit = 5) {}
    public function insert_gen_data() {}
    private function get_new_questions() {}
    private function insert_question() {}
    public function insert_new_data() {}
    /**
     * Generates questions using OpenAI API based on provided parameters.
     *
     * @param array $postData Input data containing question generation parameters.
     * @return void Outputs JSON directly.
     */
    private function gen_qus(array $postData)
    {
        // TODO: Handle 'req_id' if needed
        if (isset($postData['req_id'])) {
            // Handle request ID logic here
        }

        /** -----------------------
         * Difficulty Mapping
         * --------------------- */
        $difficultyMap = [
            1 => 'easy-difficulty',
            2 => 'medium-difficulty',
            3 => 'difficulty'
        ];
        $difficulty = $difficultyMap[$postData['difficulty_level']] ?? 'very-difficulty';

        /** -----------------------
         * Subjective Type & Topics
         * --------------------- */
        $subjective_type = $postData['subjective_type'] ?? '';
        $topic     = '';
        $subtopic  = '';

        // Fetch topic name
        if ($topicData = $this->TopicModel->get_topic_name($postData['topic_id'])) {
            $topic = $topicData->topic_name;
        }

        // Fetch subtopic name
        if ($subtopicData = $this->TopicModel->get_subtopic_name($postData['subtopic_id'])) {
            $subtopic = $subtopicData->topic_name;
        }

        /** -----------------------
         * Class & Subject Names
         * --------------------- */
        $class_name   = $this->get_class_name($postData['class_id']);
        $subject_name = $this->get_subject_name($postData['subject_id']);

        /** -----------------------
         * API Setup
         * --------------------- */
        $api_key = getenv('OPENAI_API_KEY');; // TODO: Store securely in .env
        $api_url = getenv('OPENAI_API_URL');
        $prompt  = '';

        /** -----------------------
         * Question Type Handling
         * --------------------- */
        if (isset($postData['question_type'])) {
            // Remove empty/false values
            $question_type = array_filter($postData['question_type']);

            // Get type keys
            $question_type = array_keys($question_type);
            $postData['question_type']       = $question_type;
            $postData['question_type_json']  = json_encode($question_type);

            // Build prompt based on question types
            if (
                isset($question_type[0], $question_type[1]) &&
                $question_type[0] == 1 &&
                $question_type[1] == 2
            ) {
                // Both MCQ & Subjective
                $prompt = "Generate {$postData['limit']} {$difficulty} questions on {$subtopic} {$topic} {$subject_name} for {$class_name}, including both short subjective questions and multiple-choice questions in JSON single array format with question type, answer and explanation of each question.";
            } else {
                // Single type only
                $qType = ($question_type[0] == 1) ? 'MCQ' : 'Subjective';
                $prompt = "Generate {$postData['limit']} {$difficulty} {$subjective_type} {$qType} questions for {$class_name} in {$subject_name} topic {$subtopic} {$topic} with answers and explanation in JSON format";
            }
        } else {
            echo json_encode(['error' => 'Question type not correct, Please try again later']);
            return;
        }

        /** -----------------------
         * OpenAI API Request Data
         * --------------------- */
        $data = [
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'model'       => 'gpt-4o', // Use gpt-3.5-turbo if needed
            'temperature' => 0.5,
            'max_tokens'  => 4000
        ];
        $data_json = json_encode($data);

        /** -----------------------
         * cURL API Call
         * --------------------- */
        $ch = curl_init($api_url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $data_json,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $api_key,
            ]
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            echo json_encode(['error' => 'cURL Error: ' . curl_error($ch)]);
            curl_close($ch);
            return;
        }

        file_put_contents("chatgpt.log", date('Y-m-d H:i:s') . ' - ' . $response . PHP_EOL, FILE_APPEND);
        $result = json_decode($response, true);

        if (isset($result['error'])) {
            echo json_encode(['error' => 'API Service Unavailable, Please try again later']);
            curl_close($ch);
            return;
        }

        /** -----------------------
         * Save Query & Response
         * --------------------- */
        $postData['prompt']   = $prompt;
        $postData['response'] = $response;
        $content              = $result['choices'][0]['message']['content'] ?? '';

        $query_Id = $this->insert_gen_query($postData, $content);
        if ($query_Id) {
            $this->insert_data($postData, $query_Id, $content);

            // Prepare final response
            $topic_data = [
                'q_ids'     => [],
                'questions' => $this->fetch_questions(['query_id' => $query_Id], 1, 50),
                'total'     => $this->get_total_questions(['query_id' => $query_Id])
            ];

            echo json_encode(['list' => [$topic_data]]);
        }

        curl_close($ch);
    }

    private function insert_gen_query($post_data, $content_data = null) {}
    private function insert_data($post_data, $qid, $content_data) {}
    private function insert_mcq_qus($questions, $post_data, $qid) {}
    private function get_answer_type($questions) {}
    private function find_correct_answer($q, $type)
    {
        if (isset($q['options'])) {
            $options = $q['options'] ?? [];
        } else if (isset($q['choices'])) {
            $options = $q['choices'] ?? [];
        } else if (isset($q['multiple-choice'])) {
            $options = $q['multiple-choice'] ?? [];
        } else {
            return '';
        }
        $correct_answer = 0;
        $k = 1;
        foreach ($options as $key => $o_val) {
            $answer = '';
            if (isset($q['answer'])) {
                $answer = $q['answer'];
            } else if (isset($q['correct_answer'])) {
                $answer = $q['correct_answer'];
            } else if (isset($q['correctAnswer'])) {
                $answer = $q['correctAnswer'];
            }
            if ($type == 'alpha') {
                $correct_answer = array_search(strtolower($answer), [1 => 'a', 2 => 'b', 3 => 'c', 4 => 'd']);
            } else if ($type == 'value') {
                if ($o_val == $answer) {
                    $correct_answer = $k;
                }
            } else if ($type == 'index') {
                if ($key == $answer) {
                    $correct_answer = $k;
                }
            }
            $k++;
        }
        // echo $correct_answer;
        return $correct_answer;
    }
    private function insert_subjective_qus($questions, $post_data, $qid) {}
    private function qus_exists($q, $postData) {}

    private function gen_pdf_paper($prompt, $questions)
    {
        $mpdf = new Mpdf([
            'default_font' => 'mukta'
        ]);
        $mpdf->autoScriptToLang = true;
        $mpdf->baseScript = 1;
        $mpdf->autoLangToFont = true;
        $html = view('templates/pdf_html/questions', ['prompt' => $prompt, 'questions' => $questions]);
        $mpdf->WriteHTML($html);
        $mpdf->Output('download.pdf', 'F'); //'F' for save 'D' for download; 'I' for inline display
        // die;
    }
    public function gen_pdf() {}
    public function gen_paper() {}
    public function paper_view()
    {
        return view('templates/paper_view');
    }
    public function paper_preview()
    {
        return view('templates/paper_preview');
    }
    public function paper_edit()
    {
        return view('templates/paper_edit');
    }
    public function edit_paper($id)
    {
        $access = [];
        if (!empty($this->access->paper_list)) {
            $access = $this->access->paper_list;
        }
        $user_id = session()->get('admin_id');
        $school_list = $campus_list = $section_list = [];
        $db = db_connect('default');
        $builder = $db->table('qus_paper_draft');
        $paper_data = $builder->select('*')->where('id', $id)
            ->get()
            ->getRowArray();
        // pdd($paper_data);
        if ($paper_data) {
            $paper_data['campus_ids'] = json_decode($paper_data['campus_ids']);
            $paper_data['campus_list'] = $this->get_campus_list($paper_data['campus_ids']);
            $paper_data['section'] = explode(',', $paper_data['section_ids']);
            if ($paper_data['paper_query'])
                $paper_data['paper_query'] = json_decode($paper_data['paper_query'], true);
            $sdate = $paper_data['schedule_start'];
            $paper_data['start_date'] = date('Y-m-d', strtotime($sdate));
            $paper_data['start_hour'] = date('H', strtotime($sdate));
            $paper_data['start_minute'] = date('i', strtotime($sdate));
            $edate = $paper_data['schedule_end'];
            $paper_data['end_date'] = date('Y-m-d', strtotime($edate));
            $paper_data['end_hour'] = date('H', strtotime($edate));
            $paper_data['end_minute'] = date('i', strtotime($edate));
            $builder = $db->table('admin_login');
            $user_data = $builder->select('username,full_name')->where('admin_id', $paper_data['generate_by'])
                ->get()
                ->getRowArray();
            $paper_data['generate_by_name'] = $user_data['full_name'];
            $section_list = $this->SectionModel->section_list(false, '1');
            if (@session()->get('role_id') == '1') { //admin
                // if (!empty($paper_data['campus_id'])) {
                //     $campus = $this->SchoolModel->getdataCampus($paper_data['school_id'], $paper_data['campus_id']);
                //     if (!empty($paper_data['section']) && $campus) {
                //         $section_list = $this->SchoolModel->getSectionname_by_ids($campus[0]->section);
                //     } else {
                //         $section_list = $this->SchoolModel->getSectionname_by_ids();
                //     }
                // }
                // pdd($section_list);
                //$section_list = $this->SectionModel->section_list(false, '1');
                $school_list  = $this->SchoolModel->getSchool_for_dropdown();
                $campus_list  = $this->SchoolModel->getCampus_for_dropdown($paper_data['school_id']);
                //$data['school_list'] = json_encode($school_list);
            } else if (@session()->get('role_id') == '2') { //school
                if (!empty($paper_data['campus_id'])) {
                    $campus_list  = $this->SchoolModel->getCampus_for_dropdown($paper_data['school_id']);
                    // $campus = $this->SchoolModel->getdataCampus(false, $paper_data['campus_id']);
                    // if (!empty($paper_data['section'])) {
                    //     $section_list = $this->SchoolModel->getSectionname_by_ids($campus[0]->section);
                    // }
                }
                //$section_list = $this->SectionModel->section_list(false, '1');
            } else if (@session()->get('role_id') == '3') { //campus
                $campus_id =  @session()->get('campus_id') ? @session()->get('campus_id') : false;
                $campusdata = $this->SchoolModel->getcampusdata_by_code(false, $campus_id);
                // if (!empty($campusdata[0]->section)) {
                //     $section_list = $this->SchoolModel->getSectionname_by_ids($campusdata[0]->section);
                // }
            } else if (@session()->get('role_id') == '4') { //Teacher
                $teacher_id =  @session()->get('teacher_id') ? @session()->get('teacher_id') : false;
                $teacherdata = $this->StudentModel->getTeacherdata($teacher_id, '1');
                if (!empty($teacher_id)) {
                    $sectionids = [];
                    $class = [];
                    $outputArray = [];
                    // Check if the teacher is a class teacher
                    if ($teacherdata->are_you_class_teacher == '1') {
                        $tchrcls = $this->SchoolModel->getClassteacher($teacherdata->teacher_id);
                        foreach ($tchrcls as $keyc => $clsval) {
                            // $outputArray[] = $clsval->class_id . '-' . trim($clsval->section_id);
                            //array_push($classids, $clsval->class_id);
                            array_push($sectionids, $clsval->section_id);
                        }
                    }
                    // If the teacher is also a subject teacher, fetch related data
                    if ($teacherdata->are_you_subject_teacher_also == '1') {
                        $teacher_sub = $this->SchoolModel->getsubject_by_teacher_id($teacherdata->teacher_id);
                        foreach ($teacher_sub as $val) {
                            $teacher_sub_class = $this->SchoolModel->getclass_by_t_sub_id($val->t_subject_id);
                            // echo "<pre>";print_r($teacher_sub_class); 
                            // echo "</pre>";
                            foreach ($teacher_sub_class as $item) {
                                // array_push($classids, $item->class_id);
                                //      array_push($sectionids, $item->section_id);
                                $sections = explode(',', $item->section_id);
                                foreach ($sections as $section) {
                                    //$outputArray[] = $item->class_id . '-' . trim($section);
                                    // array_push($classids, $item->class_id);
                                    array_push($sectionids, trim($section));
                                }
                            }
                            foreach ($teacher_sub_class as $sub) {
                                // array_push($classids, $sub->class_id);
                                array_push($sectionids, $sub->section_id);
                                //array_push($class, $sub->class_id."-".$sub->section_id);
                            }
                        }
                    }
                    // Remove duplicates from class and section IDs
                    $sectionids = array_unique($sectionids);
                    // // Convert arrays to strings for further database queries
                    $sectionids = implode(',', $sectionids);
                    // Fetch class and section names based on the retrieved IDs
                    // if (!empty($sectionids)) {
                    //     $section_list = $this->SchoolModel->getSectionname_by_ids($sectionids);
                    // }
                }
            } else if (@session()->get('role_id') == '6') {
                //Co-Ordinator
                $coordinator_id =  @session()->get('coordinator_id') ? @session()->get('coordinator_id') : false;
                $coordinator = $this->CoordinatorModel->getCoordinatorrecordbyID($coordinator_id);
                // if (!empty($coordinator->section)) {
                //     $section_list = $this->SchoolModel->getSectionname_by_ids($coordinator->section);
                // }
            }
        }
        // echo json_encode($paper_data);
        echo json_encode(['access' => $access, 'paper_data' => $paper_data, 'section_list' => $section_list, 'school_list' => $school_list, 'campus_list' => $campus_list]);
        die;
    }
    public function save_paper()
    {
        $user_id = session()->get('admin_id');
        $post_data = $this->request->getPost();
        if ($post_data) {
            // pdd($post_data);
            if ($post_data['status'] > 1) {
                echo json_encode(['status' => false, 'msg' => 'Please select status for the paper']);
                die;
            }
            $schedule_start_date = $this->get_datetime($post_data['start_date'], $post_data['start_hour'], $post_data['start_minute']);
            $schedule_end_date = $this->get_datetime($post_data['end_date'], $post_data['end_hour'], $post_data['end_minute']);
            $data = [
                'paper_title' => $post_data['paper_title'],
                'max_marks' => $post_data['max_marks'],
                'paper_type' => $post_data['paper_type'],
                'exam_mode' => $post_data['exam_mode'],
                'schedule_start' => $schedule_start_date,
                'schedule_end' => $schedule_end_date,
                'duration' =>  $post_data['duration'],
                'share' => $post_data['share'],
                'status' => $post_data['status']
            ];
            if (isset($post_data['school_id']) && $post_data['school_id']) {
                $data['school_id'] = $post_data['school_id'];
            }
            if (isset($post_data['campus_ids']) && $post_data['campus_ids']) {
                $data['campus_ids'] = json_encode($post_data['campus_ids']);
                if (count($post_data['campus_ids']) > 1) {
                    $sections = $this->get_sections();
                    $data['section_ids'] = implode(',', $sections);
                } else {
                    $data['section_ids'] = implode(',', $post_data['section']);
                }
            }
            if (isset($post_data['section']) && $post_data['section']) {
                //$data['section_ids'] = implode(',', $post_data['section']);
            }
            if (isset($post_data['grace_time'])) {
                //'grace_time' =>  $post_data['grace_time'],
                $data['grace_time'] = $post_data['grace_time'];
            }
            if ($post_data['status'] == 1) {
                $data['publish_date'] = date('Y-m-d H:i:s');
            }
            $db = db_connect('default');
            $builder = $db->table('qus_paper_draft');
            $builder->where('id', $post_data['paper_id']);
            $builder->set($data);
            $builder->update();
            echo json_encode(['status' => true]);
            die;
        }
        echo json_encode(['status' => false, 'msg' => 'invalid request']);
        die;
    }

    public function paper_report()
    {
        return view('templates/paper_report');
    }
    private function attempt_question($post_data, $paper_id, $student_id) {}


    public function paper_bank_view()
    {
        return view('paper_bank/paper_bank_view');
    }
    public function paper_bank_preview()
    {
        return view('paper_bank/paper_bank_preview');
    }
    public function get_paper_bank($id) {}
    public function paper_bank_edit()
    {
        return view('paper_bank/paper_bank_edit');
    }

    public function paper_bank_assign()
    {
        $data = [];
        return view('paper_bank/paper_bank_assign', $data);
    }

    /**
     * Imports questions from a CSV/XLS/XLSX file and saves them into the database.
     *
     * @return void
     */
    public function import_csv()
    {
        $user_id         = session()->get('admin_id');
        $post_data       = $this->request->getVar();
        $academic_year_id = $post_data['academic_year_id'] ?? 0;
        $board_id        = $post_data['board_id'] ?? 0;
        $class_id        = $post_data['class_id'] ?? 0;
        $subject_id      = $post_data['subject_id'] ?? 0;

        /** -----------------------
         * Image Folder Setup
         * --------------------- */
        $image_folder = '';
        if (!empty($post_data['folder']) && $post_data['folder'] != '0') {
            $image_folder = $post_data['folder'];
        }
        if (!empty($post_data['new_folder'])) {
            $image_folder = $post_data['new_folder'];
        }

        $file = $this->request->getFile('import_csv');

        /** -----------------------
         * File Upload Validation
         * --------------------- */
        if (!$file || !$file->isValid() || $file->hasMoved()) {
            showJson(false, 'File Upload Error...!', false);
            return;
        }

        /** -----------------------
         * Create AWS Folder if Needed
         * --------------------- */
        if ($image_folder !== '') {
            $folder_path = "question/board_{$board_id}/class_{$class_id}/subject_{$subject_id}/{$image_folder}/";
            $aws = new AWS();
            $aws->create_folder($folder_path);
        } else {
            $folder_path = '';
        }

        /** -----------------------
         * File Reader Selection
         * --------------------- */
        $fileType = $file->getClientMimeType();
        switch ($fileType) {
            case 'text/csv':
            case 'text/plain':
                $reader = new Csv();
                break;
            case 'application/vnd.ms-excel':
                $reader = new Xls();
                break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                $reader = new Xlsx();
                break;
            default:
                showJson(false, 'Unsupported file type!', false);
                return;
        }

        /** -----------------------
         * Read Spreadsheet
         * --------------------- */
        $spreadsheet = $reader->load($file->getTempName());
        $sheetData   = $spreadsheet->getActiveSheet()->toArray();

        // Validate image requirements
        foreach ($sheetData as $index => $row) {
            if ($index === 0) continue; // Skip header
            if ($row[7] !== '' || $row[9] !== '' || $row[11] !== '' || $row[13] !== '' || $row[15] !== '' || $row[17] !== '' || $row[20] !== '') {
                if ($folder_path === '') {
                    showJson(false, 'Folder name must be entered for image questions', false);
                    return;
                }
            }
        }

        /** -----------------------
         * Group Data Topic-Wise
         * --------------------- */
        $topicwise_data = $this->get_topicwise_data($sheetData);
        if (!$topicwise_data) {
            showJson(false, 'No valid topic data found', false);
            return;
        }

        /** -----------------------
         * Process Each Topic/Subtopic
         * --------------------- */
        $qus_order     = 1;
        $paper_bank_id = $this->create_paper_bank($post_data);  //Geneate Paper Bank of Set of Excel Questions List

        foreach ($topicwise_data as $topic_id => $topic) {
            foreach ($topic as $subtopic_id => $subtopics) {
                foreach ($subtopics as $row) {

                    /** -----------------------
                     * Parse Question Metadata
                     * --------------------- */
                    $question_type_str  = strtolower(trim($row[0]));
                    $subjective_type_str = strtolower(trim($row[1]));
                    $difficulty_level_str = strtolower(trim($row[2]));

                    $question_type = ($question_type_str === 'mcq') ? 1 : 2;
                    $subjective_type = in_array($subjective_type_str, ['short', 'long', 'very long']) ? $subjective_type_str : 'short';

                    $difficulty_map = [
                        'easy'           => 1,
                        'medium'         => 2,
                        'difficult'      => 3,
                        'very difficult' => 4
                    ];
                    $difficulty_level = $difficulty_map[$difficulty_level_str] ?? 0;

                    /** -----------------------
                     * Prepare Question Data
                     * --------------------- */
                    $qdata = [
                        'query_id'        => 0,
                        'question'        => $row[6],
                        'image_path'      => $row[7],
                        'question_type'   => $question_type,
                        'subjective_type' => $subjective_type,
                        'difficulty_level' => $difficulty_level,
                        'board_id'        => $board_id,
                        'class_id'        => $class_id,
                        'subject_id'      => $subject_id,
                        'topic_id'        => $topic_id,
                        'subtopic_id'     => $subtopic_id,
                        'descriptor'      => $row[18],
                        'explanation'     => $row[19],
                        'explanation_image' => $row[20],
                        'marks'           => $row[23],
                        'image_folder'    => $image_folder,
                        'status'          => '1',
                        'generated_by'    => $user_id,
                    ];

                    /** -----------------------
                     * Build Options Array
                     * --------------------- */
                    $options = [];
                    $option_columns = [
                        [8, 9],  // A, Image
                        [10, 11], // B, Image
                        [12, 13], // C, Image
                        [14, 15], // D, Image
                        [16, 17] // E, Image
                    ];

                    foreach ($option_columns as $idx => [$textCol, $imgCol]) {
                        if ($row[$textCol] || $row[$imgCol]) {
                            $options[] = [
                                'option_text' => $row[$textCol],
                                'is_correct'  => 0,
                                'image_path'  => $row[$imgCol]
                            ];
                        }
                    }

                    /** -----------------------
                     * Mark Correct Answer
                     * --------------------- */
                    $correct_answer = $row[21];
                    if ($question_type === 1) { // MCQ
                        $answer_map = [1 => 'a', 2 => 'b', 3 => 'c', 4 => 'd', 5 => 'e'];
                        $correct_index = array_search(strtolower($correct_answer), $answer_map);
                        if ($correct_index !== false && isset($options[$correct_index - 1])) {
                            $options[$correct_index - 1]['is_correct'] = 1;
                        }
                    } else { // Subjective
                        $options = [[
                            'option_text' => $correct_answer,
                            'is_correct'  => 1,
                            'image_path'  => $row[22]
                        ]];
                    }

                    /** -----------------------
                     * Save to DB if Not Exists
                     * --------------------- */
                    if (!$this->find_exists($qdata, $options, $post_data, $paper_bank_id, $qus_order)) {
                        // TODO: Insert question and options into DB
                        $question_id = $this->QuestionModel->insert($qdata);
                        foreach ($options as &$opt) {
                            $opt['question_id'] = $question_id;
                            //insert option data
                        }
                    }

                    $qus_order++;
                }
            }
        }
        showJson(true, 'File imported successfully!', false);
    }

    public function get_aws_image($qid = null, $image_name = null)
    {
        $question = $this->get_question($qid);
        if ($question) {
            $image_folder = '';
            if ($question['image_folder'] != '')
                $image_folder = $question['image_folder'] . '/';
            $aws = new AWS();
            $s3Key = 'question/board_' . $question['board_id'] . '/class_' . $question['class_id'] . '/subject_' . $question['subject_id'] . '/' . $image_folder . $image_name;
            $image_data =  $aws->view($s3Key);
            echo $image_data;
        }
    }
}

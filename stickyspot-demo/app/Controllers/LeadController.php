<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\LeadModel;

class LeadController extends BaseController
{
    protected $access = 0;
    private $leadModel;
    protected $helpers = ['url', 'file', 'my_helper'];

    public function __construct()
    {
        $this->leadModel = new LeadModel();
    }

    public function index()
    {
        return view('leads');
    }
    //Lead Stages Functions
    public function get_stages()
    {

        $parent_id = session()->get('parent_id');
        $user_id = session()->get('id');
        $role_id = session()->get('role');

        $access = 0;
        if (USER_TEAM == $role_id) {
            $pModel = new \App\Models\PermissionRoleModel();
            $access = $pModel->loggedUserPermission(LEAD_STAGE_ACCESS);
        } else {
            $access = FULL_ACCESS;
        }

        // $leads = $this->leadModel->where("user_id", session()->get('id'))->orderBy('order')->findAll();
        $db = db_connect('default');
        $builder = $db->table('lead_stages');
        $builder->select('*');
        if ($parent_id == 0) {
            $builder->where('parent_id', $user_id);
            $builder->Orwhere('user_id', $user_id);
        } else {
            if ($access > 0) {
                $builder->where('parent_id', $parent_id);
                $builder->Orwhere('user_id', $parent_id);
                $builder->Orwhere('user_id', $user_id);
            }
        }
        $builder->orderBy('order', 'asc');

        $lead_stages =   $builder->get()->getResult();
        // echo $db->getLastQuery();die;

        // pdd($lead_stages);
        $totLeads = count($lead_stages);
        $cData = [];    //Chart Data
        foreach ($lead_stages as $stage) {
            $percentage = 15000 * ($totLeads * 10) / 100;
            $cData[] = [$stage->title, $percentage];
            $totLeads -= 1;
            // pdd($cData);
        }
        // $cData = [
        //     ['Stage A', 15000],
        //     ['Stage B', 4064],
        //     ['Stage C', 1987],
        //     ['ABC', 976],
        //     ['Stage D', 846],
        //     ['Stage Z', 846]
        // ];
        // pdd($cData);
        echo json_encode(['lead_stages' => $lead_stages, 'cData' => $cData, 'access' => $access]);
        die;
    }
    public function save_stage()
    {
        $parent_id = session()->get('parent_id');
        $user_id = session()->get('id');
        $role_id = session()->get('role');

        $access = 0;
        if (USER_TEAM == $role_id) {
            $pModel = new \App\Models\PermissionRoleModel();
            $access = $pModel->loggedUserPermission(LEAD_STAGE_ACCESS);
        } else {
            $access = FULL_ACCESS;
        }

        if ($access < WRITE_ACCESS) {
            showJson(false, "You don't have access to change Lead Stage. Please contact to your Admin.", false);
        }

        if ($this->request->getMethod() === 'post') {

            // pdd($_POST);
            $stage_id = $this->request->getPost('id');
            $stage_title = $this->request->getPost('title');
            $stage_status = $this->request->getPost('status');
            $owner_id = $this->request->getPost('user_id');

            $data = [
                'parent_id' => $parent_id,
                'user_id' => $user_id,
                'title' => $stage_title,
            ];

            if ($stage_id) {
                if ($owner_id == $user_id || $owner_id == $parent_id) {
                    $saveReturn = $this->leadModel
                        ->where('id', $stage_id)
                        // ->where('user_id',$owner_id)
                        ->set($data)
                        ->update();
                } else {
                    showJson(false, "You don't have authority to change anything.", false);
                }
            } else {
                $saveReturn = $this->leadModel->insert($data);
            }
            if ($saveReturn == false) {
                showJson(false, 'Add Error', false);
            }
            if ($stage_id)
                showJson(true, 'Lead Stage has been updated successfully', false);
            else
                showJson(true, 'Lead Stage has been created successfully', false);
        }
        showJson(false, 'Unalbe to change lead stage due to tachinal issue, please try later.', false);
    }
    //Lead Sources Functions
    public function get_source($source_id)
    {

    }
    //Get Lead sources
    public function get_sources()
    {

    }
    //Get Lead source
    public function save_source()
    {

    }
    //Insert lead
    public function import_lead()
    {

    }
    //Export Lead
    public function export_lead($sid)
    {

    }
}
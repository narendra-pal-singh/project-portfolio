<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Class : Complaint_model
 * Complaint model class to get to handle complaint related data 
 * @author : NPSINGH
 * @version : 1.0
 * @since : 01 Mar 2021
 */
class Complaint_model extends CI_Model
{
    function create($data)
    {
        return $this->db->insert('complaints', $data);
    }
    function update($id, $data)
    {
        $this->db->where("id", $id);
        return $this->db->update('complaints', $data);
    }
    function getStats($user_id)
    {
        $userBuildings = $this->getUserBuildings($user_id);
        $this->db->select("count(*) as tot,status");
        $this->db->from("complaints c");
        $this->db->group_by("c.status");
        $this->db->order_by("c.status");
        if (isAdmin()) {
            //Listing All without any condition
        } elseif (isSectionHead() || isCaretaker()) {
            $this->db->where('c.section_head_user_id', $user_id);
        } else {
            $this->db->where('c.user_id', $user_id);
        }
        $query = $this->db->get();
        $stats = $query->result();
        $overdues = $this->getOverdueStats($user_id);
        $overduesTot = 0;
        $arr = array();
        foreach ($stats as $key => $val) {
            $t = 0;
            if (isset($overdues[$val->status])) {
                $t = $overdues[$val->status];
                $overduesTot += $t;
            }
            $arr[$val->status] = $val->tot - $t;
        }
        $arr[5] = $overduesTot;
        if (count($arr) < 6) {
            for ($i = 0; $i < 6; $i++) {
                if (!isset($arr[$i]))
                    $arr[$i] = 0;
            }
        }
        return $arr;
    }
    function getOverdueStats($user_id)
    {
        $userBuildings = $this->getUserBuildings($user_id);
        $this->db->select("count(*) as tot,status");
        $this->db->from("complaints c");
        $this->db->where("c.status_overdue", "1");
        $this->db->group_by("c.status");
        $this->db->order_by("c.status");
        if (isAdmin()) {
            //Listing All without any condition
        } elseif (isSectionHead() || isCaretaker()) {
            $this->db->where('c.section_head_user_id', $user_id);
        } else {
            $this->db->where('c.user_id', $user_id);
        }
        $query = $this->db->get();
        //echo $this->db->last_query();
        //dd($complaints = $query->result());
        $arr = array();
        foreach ($query->result() as $key => $val) {
            $arr[$val->status] = $val->tot;
        }
        return $arr;
    }
    function getStatsBySectionHead()
    {
        $this->db->select("count(*) as tot,c.status,c.section_head_user_id,u.username");
        $this->db->from("complaints c");
        $this->db->join("users u", "u.id = c.section_head_user_id");
        $this->db->group_by("c.status");
        $this->db->group_by("c.section_head_user_id");
        $this->db->order_by("c.status");
        $query = $this->db->get();
        $complaintStats = $query->result();
        //echo $this->db->last_query();
        //dd($complaintStats);
        $arr = array();
        foreach ($complaintStats as $key => $val) {
            $arr[$val->section_head_user_id][$val->status] = $val;
        }
        //dd($arr);
        return $arr;
    }
    function getOverdueStatsBySectionHead()
    {
        $this->db->select("count(*) as tot,c.status,c.section_head_user_id");
        $this->db->from("complaints c");
        $this->db->group_by("c.status");
        $this->db->group_by("c.section_head_user_id");
        $this->db->order_by("c.status");
        $this->db->where("c.status_overdue", "1");
        $query = $this->db->get();
        $complaintStats = $query->result();
        //echo $this->db->last_query();
        //dd($complaintStats);
        $arr = array();
        foreach ($complaintStats as $key => $val) {
            $arr[$val->section_head_user_id][$val->status] = $val;
        }
        //dd($arr);
        return $arr;
    }
    public function getStatsByBuildings($user_id)
    {
        
    }
    public function getOverdueByBuildings($user_id)
    {

    }
    function getBuildingsStats($user_id)
    {

    }
    function getBuildingsOverdueStats($user_id)
    {
        $userBuildings = $this->getUserBuildings($user_id);
        $this->db->select("count(*) as tot,c.status,c.building_id,b.building_name");
        $this->db->from("complaints c");
        $this->db->join("buildings b", "b.id = c.building_id");
        $this->db->where("c.status_overdue", '1');
        $this->db->group_by("c.status");
        $this->db->group_by("c.building_id");
        $this->db->order_by("b.building_name");
        if (isAdmin()) {
            //Listing All without any condition
        } elseif (isSectionHead() || isCaretaker()) {
            $this->db->where('c.section_head_user_id', $user_id);
        }
        $query = $this->db->get();
        //echo $this->db->last_query();
        //dd($complaints = $query->result());
        return $query->result();
    }
    
    function getComplaint($complaint_id = null)
    {
        $this->db->select("c.*");
        $this->db->from("complaints c");
        $this->db->where('c.id', $complaint_id);
        return $this->db->get()->row();
    }
    //Get All Complaints of Logged User
    function get($user_id, $complaintNo = null, $data = null)
    {
        
    }
    function search($user_id, $data)
    {
        $userBuildings = $this->getUserBuildings($user_id);
        //$this->db->select("c.*, b.building_name, ct.title as category_name");
        $this->db->select("c.*,u.username");
        $this->db->from("complaints c");
        //Joining for UserName
        $this->db->join("users u", "u.id = c.user_id");
        if (isAdmin()) {
            //Listing All without any condition
        } elseif (isSectionHead() || isCaretaker()) {
            $this->db->group_start()
                ->or_where('c.user_id', $user_id)
                //If there's not buidling of section head then return null;
                ->or_where_in('c.building_id ', $userBuildings)
                ->group_end();
        } else {
            //Logged User Complaints
            $this->db->where('c.user_id', $user_id);
        }
        $this->db->order_by("c.updated", "desc");
        //Filter Condition
        if (isset($data['category']) && $data['category'] != null)
            $this->db->where('c.category_id', $data['category']);
        if (isset($data['building']) && $data['building'] != null)
            $this->db->where('c.building_id', $data['building']);
        if (isset($data['status']) && $data['status'] != null) {
            if ($data['status'] == 5)
                $this->db->where('c.status_overdue', '1');
            else
                $this->db->where('c.status', $data['status']);
        }
        if (isset($data['complaint_by']) && $data['complaint_by'] != null) {
            $this->db->where('c.section_head_user_id', $data['complaint_by']);
        }
        if (isset($data['fdate']) && $data['fdate'] != null) {
            if (isset($data['tdate']) && $data['tdate'] != null)
                $this->db->where('DATE(c.created) BETWEEN "' . $data['fdate'] . '" AND "' . $data['tdate'] . '"');
        }
        if (isset($data['year']) && $data['year'] != null) {
            $this->db->where('YEAR(c.created) BETWEEN ' . $data['year'] . ' AND ' . ($data['year'] + 1));
        }
        $page = $this->input->post('page');
        $limit = $this->input->post('limit');
        if (!$page) $page = 1;
        if (!$limit) $limit = 5;
        $this->db->limit($limit, ($page - 1) * $limit);
        //dd($limit);
        $query = $this->db->get();
        $complaints = $query->result();
        if (!$complaints) return [];
        else return $complaints;
        //return $query->result();
    }
    function getOverdueComplaints($user_id)
    {

    }
    function setOverdue()
    {

    }
    function getOverdue()
    {
        
    }
}

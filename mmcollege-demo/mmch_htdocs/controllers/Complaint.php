<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Complaint extends Admin_Controller {
  public function __construct(){
    parent::__construct();
    if($this->is_logged() == false){
			//dd('user c');
			redirect(base_url('auth/login'),'refresh');
		}
    //Check Access Level
    //$this->accessTypes()
    $this->load->model('complaint_model');
    $this->load->model('complaint_category_model','CCM');
    $this->load->model('building_model');
  }
	public function index(){
    $this->load->view('layout/frontend');
	}
  public function checkOverdue(){
    //Check Overdue Complaint and Mark to that complain
  }
  public function card_status(){
    $cards = array('totYellow'=>0,'totRed'=>0);
    //create logic of Red and Yellow card when complain overdue
  }
  //getComplaints
  public function get($complaintNo = null, $data = null) 
  {

  }
  public function search()
  {

  }
  //Get complaint Stats for pieChartData, buildingsChartData
  public function stats(){
  }
  //
  
  //Create Complaint
  public function create() 
  {

  }
  //Update Complaint
  public function update()
  {
  
  }
  //get Section Head of the Building
  private function getSectionHeadOfBuilding( $building_id ){
    
  }
  //Using this function for form validation with multiple fields
  public function getFieldName($key){
    $fieldsName = array(
      'title'         => 'Title',
      'description'   => 'Description',
      'department_id' => 'Department Name',
      'category_id'   => 'Category',
      'work_area'     => 'Work Area',
      'status'        => 'Status'
    );
    return $fieldsName[$key];
  }
  public function photo_upload() 
  {

  }
  public function genrateComplaintNumber()
  {

  }
  //This for Get Text Status based on Status for Complaint Listing Page
  public function getComplaintStatus(){
    $status = array(
      0 => "Open",
      1 => "In-Process",
      2 => "Closed(Pending)",
      3 => "Closed",
      4 => "Re-Open",
      5 => "Overdue"
    );
    return $status;
  }
  //Send Mail when  Complaint created
  private function sendMailComplaintPost($data)
  {

  }
  
}
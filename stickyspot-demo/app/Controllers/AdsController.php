<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UserModel;

class AdsController extends BaseController
{

    protected $fb;
    protected $helpers = ['url', 'file', 'my_helper'];

    public function __construct()
    {
        $session = session();
        $this->fb = new \Facebook\Facebook([
            'app_id' => getenv('FB_API_ID'),
            'app_secret' => getenv('FB_API_SECRET'),
            'default_graph_version' => getenv('FB_GRAPH_VERSION'),
            'persistent_data_handler' => 'session',
        ]);
    }
    //Facebook Login and FB user exists our system then redirect ads/accounts 
    //If new facebook user then List pages and connect with ads account then save in  our system
    public function index()
    {
        
    }

    //Get connected Ad accounts of the User
    public function userAdConnected()
    {
        
    }
    
    //get User Ad Accounts
    public function adsAccounts()
    {
        
    }

    //Get Facebook Ad Account and Save Accounts
    public function fbAdsAccounts()
    {

    }

    private function getFbAdAccounts()
    {

    }

    public function adsPages()
    {

    }
    public function page_disconnect()
    {

    }

    //Get User Ad Accounts based on User ID from Database
    private function getUserAdAccount()
    {
        
    }

    //Get campaigns of ad_account_id
    public function campaign()
    {
        
    }

    //Get User Access token from the database
    function userFBToken()
    {
        $access_token = session()->get('access_token');
        $user_id = session()->get('id');
        $role_id = session()->get('role');
        if (USER_TEAM == $role_id) {
            $parent_id = session()->get('parent_id');
            $user_id = $parent_id;
        }
        if (empty($access_token)) {
            $userModel = new UserModel();
            $userData = $userModel->find($user_id);
            $access_token = $userData['fb_token'];
        }
        return $access_token;
    }

    public function callGraphAPI($src_id, $params, $access_token)
    {
        $data = [];
        if (empty($access_token)) {
            return null;
        }
        try {
            $graph_response = $this->fb->get('/' . $src_id . $params, $access_token);

            $data = $graph_response->getGraphNode()->asArray();
            //$data = $graph_response->getGraphEdge()->asArray();

        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            echo 'Graph returned an error: ' . $e->getMessage();
            echo "<br>" . '/' . $src_id . $params;
            exit;
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            echo "<br>" . '/' . $src_id . $params;
            exit;
        }
        return $data;
    }

    public function getUserPages($user_id)
    {

    }

    public function getLeadsFromPages()
    {
        //Get UserPages
        //Get All Forms of the Page
        //Get forms_lead from Form
        //Get Lead from from_lead
        //Save Lead as a Contact
    }

    public function leads()
    {
        //Get All campaigns of the Ad Account using FB callGraphAPI
        //Get All Ads of the campaigns
        //Get All Leads of the Ad
        //Get data form the Lead ID
        //Save Lead
    }
}
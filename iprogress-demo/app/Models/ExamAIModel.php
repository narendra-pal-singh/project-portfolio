<?php

namespace App\Models;

use CodeIgniter\Model;

class ExamAIModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'gen_query';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields    = [
        'exam_type',
        'subjective_type',
        'difficulty_level',
        'board',
        'class',
        'subject',
        'topic',
        'num_qus',
        'content',
        'generated_by'
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['beforeInsert'];
    protected $beforeUpdate   = ['beforeUpdate'];

    /**
     * Get generated queries by exam type.
     *
     * @param string|null $exam_type
     * @return array
     */
    public function getGenQuery(?string $exam_type = null): array
    {
        $builder = $this->builder()->select('*');
        if (!empty($exam_type)) {
            $builder->where('exam_type', $exam_type);
        }
        return $builder->get()->getResultArray();
    }
    public function getQueryUsers(): array
    {
        return $this->db->table($this->table) // Uses $table = 'gen_query'
            ->select('gen_query.generated_by, admin_login.admin_id, admin_login.full_name')
            ->join('admin_login', 'admin_login.admin_id = gen_query.generated_by')
            ->groupBy('gen_query.generated_by')
            ->orderBy('admin_login.full_name', 'ASC')
            ->get()
            ->getResultArray();
    }
    /**
     * Update data in a given table.
     *
     * @param string $table_name
     * @param mixed  $id
     * @param string $field_name
     * @param array  $data
     * @return bool
     */
    public function updateData(string $table_name, $id, string $field_name, array $data): bool
    {
        $db = db_connect();
        return $db->table($table_name)
            ->where($field_name, $id)
            ->update($data);
    }
}

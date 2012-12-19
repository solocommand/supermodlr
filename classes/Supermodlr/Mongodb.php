<?php


class Supermodlr_Mongodb extends Supermodlr_Db {

	protected $port = '27017';
	protected $replset = FALSE;	
	protected $slaveOkay = FALSE;	
	protected $safe = TRUE;	
	protected $fsync = FALSE;		
	private $mongodb = NULL;
	private $coll = NULL;
	private $last_id = NULL;
	
	public $creates = 0;
	public $updates = 0;
	public $reads = 0;
	public $deletes = 0;
	/**
	  * 
	  * @returns bool
	  */
	public function driver_connect($params = array()) {
	
		if (is_null($this->connection)) {
			//host
			$host = (isset($params['host'])) ? $params['host'] : $this->host;
			
			//dbname
			$dbname = (isset($params['dbname'])) ? $params['dbname'] : $this->dbname;
			
			//port
			$port = (isset($params['port'])) ? $params['port'] : $this->port;
			
			//user
			$user = (isset($params['user'])) ? $params['user'] : $this->user;
			
			//pass
			$pass = (isset($params['pass'])) ? $params['pass'] : $this->pass;
			
			//replset
			$replset = (isset($params['replset'])) ? $params['replset'] : $this->replset;	

			//slaveOkay
			$slaveOkay = (isset($params['slaveOkay'])) ? $params['slaveOkay'] : $this->slaveOkay;
			
			//safe
			$safe = (isset($params['safe'])) ? $params['safe'] : $this->safe;		

			//fsync
			$fsync = (isset($params['fsync'])) ? $params['fsync'] : $this->fsync;		
			
			try {
			
				if (!empty($user)) {
					$this->connection = new Mongo("mongodb://{$user}:{$pass}@{$host}"); // Connect to Mongo Server
				} else {
					$this->connection = new Mongo("mongodb://{$host}"); // Connect to Mongo Server
				}
				$this->mongodb = $this->connection->selectDB($dbname); // Connect to Database;
				
			} 
			catch (Exception $Error) 
			{
				$this->set_error($Error);
			}
		}
		//return TRUE if a connection was made.  return FALSE if the connection failed
		return (!is_null($this->connection));
	}

	/**
	  * @returns bool	  
	  */
	public function driver_close($params = array()) {
	
	}	
	
	/**
	  * @param string $into required
	  * @param array $set required	  
	  * @param bool|int $safe = $this->safe	  
	  * @param bool $fsync = this->fsync	  
	  * @returns mixed (bool === FALSE on failure, MongoId on success)	  
	  */
	public function driver_create($params = array()) 
	{
		//create connection if not set
		if ($this->connection === NULL)
		{
			$connected = $this->connect();
			if (!$connected)
			{
				return FALSE;
			}
		}
		
		$params['safe'] = (isset($params['safe'])) ? $params['safe'] : $this->safe;
		$params['fsync'] = (isset($params['fsync'])) ? $params['fsync'] : $this->fsync;
		
		//select collection
		$this->set_coll($params['into']);

		$insert_options = array('safe' => $params['safe'], 'fsync' => $params['fsync']);
		try 
		{
			$this->mongocoll->insert($params['set'],$insert_options);
			$this->creates++;
			$this->last_id = $params['set']['_id'];
			return $params['set']['_id'];
		} 
		catch (MongoCursorTimeoutException $e) 
		{
			$this->set_error($e);
			return FALSE;
		} 
		catch (MongoCursorException $e) 
		{
			$this->set_error($e);
			return FALSE;

		}

		
	}

	/**
	  * @param string $from required table name
	  * @param array $fields = '*' field names to return. can be formatted array('col1','col2') or array(array('column'=> 'col1','alias'=> 'column1'),
	  * @param array $where = NULL format: array($col => $val)
	  * @param array|string $order = NULL
	  * @param bool $count = FALSE only return the count of found items	  
	  * @param int $limit = NULL
	  * @param int $skip = 0
	  * @param bool $slaveOkay = $this->slaveOkay
	  * @returns resource
	  */
	public function driver_read($params = array()) 
	{
		//create connection if not set
		if (is_null($this->connection))
		{
			$connected = $this->connect();
			if (!$connected)
			{
				return FALSE;
			}
		}	

		//select collection
		$this->set_coll($params['from']);			
		
		$params['fields'] = (isset($params['fields'])) ? $params['fields'] : array();
		$params['where'] = (isset($params['where'])) ? $params['where'] : array();		
		$params['safe'] = (isset($params['safe'])) ? $params['safe'] : $this->safe;
		$params['count'] = (isset($params['count'])) ? $params['count'] : FALSE;
		$params['limit'] = (isset($params['limit'])) ? $params['limit'] : NULL;
		$params['skip'] = (isset($params['skip'])) ? $params['skip'] : 0;
		$params['slaveOkay'] = (isset($params['slaveOkay'])) ? $params['slaveOkay'] : $this->slaveOkay;
		$params['fix_id'] = (isset($params['fix_id'])) ? $params['fix_id'] : TRUE;
		
		if (isset($params['where']['_id']) && is_string($params['where']['_id']) && $params['fix_id'] !== FALSE && ((string) new MongoId($params['where']['_id'])) === $params['where']['_id'])
		{
			$params['where']['_id'] = new MongoId($params['where']['_id']);
		}
		
		//convert regexp @todo make this check all levels of $where for $regexp
		foreach ($params['where'] as $key => $val) 
		{
			if (is_array($val) && isset($val['$regex']))
			{
				$params['where'][$key] = new MongoRegex($val['$regex']);
			}
		}
		
		$dbsort = array();
		if (isset($params['order']) && !empty($params['order'])) 
		{
			foreach ($params['order'] as $sort_field => $sort_val) 
			{
				if (is_numeric($sort_field) && strpos($sort_val, ' ') !== FALSE) 
				{
					list($sort_field, $sort_val) = explode(" ", trim($sort_val));
				}
				$dbsort[$sort_field] = ($sort_val === 'asc') ? 1 : -1;
			}
		}
		
		try {
		// If this is a count query, only return count
		if ($params['count']) 
		{
			$result = $this->mongocoll->find($params['where'])->count();

		} 
		// Run regular query
		else 
		{
			//if we are sorting
			if (!empty($dbsort)) 
			{
				if ($params['limit'] > 0) 
				{
					$data = $this->mongocoll->find($params['where'], $params['fields'])->sort($dbsort)->limit($params['limit'])->skip($params['skip'])->slaveOkay($params['slaveOkay']);
				} 
				else 
				{
					$data = $this->mongocoll->find($params['where'], $params['fields'])->sort($dbsort)->skip($params['skip'])->slaveOkay($params['slaveOkay']);
				}
			} 
			else 
			{
				if ($params['limit'] > 0) 
				{
					$data = $this->mongocoll->find($params['where'], $params['fields'])->limit($params['limit'])->skip($params['skip'])->slaveOkay($params['slaveOkay']);
				} 
				else 
				{
					$data = $this->mongocoll->find($params['where'], $params['fields'])->skip($params['skip'])->slaveOkay($params['slaveOkay']);
				}
			}
			$data_arry = iterator_to_array($data);
		}

		//increment read count
		$this->reads++;

		} catch (MongoCursorTimeoutException $e) {

			$this->set_error($e);
			return FALSE;

		} catch (MongoCursorException $e) {
			$this->set_error($e);
			return FALSE;

		}

		// Result sets should never be too big as they have to be loaded into memory
		return $data_arry;
	}	
	
	/**
	  * @param string $into required table name
	  * @param array $set required array($col=> $val)
	  * @param array $where = NULL format: array($col => $val)
	  * @param int $limit = NULL
	  * @param bool|int $safe = $this->safe	  
	  * @param bool $fsync = this->fsync	  
	  * @returns mixed (bool === FALSE if failed || int of affected records)
	  */
	public function driver_update($params = array()) 
	{
		//create connection if not set
		if (is_null($this->connection))
		{
			$connected = $this->connect();
			if (!$connected)
			{
				return FALSE;
			}
		}	
		$params['safe'] = (isset($params['safe'])) ? $params['safe'] : $this->safe;
		$params['fsync'] = (isset($params['fsync'])) ? $params['fsync'] : $this->fsync;
		$params['where'] = (isset($params['where'])) ? $params['where'] : array();				
		$params['fix_id'] = (isset($params['fix_id'])) ? $params['fix_id'] : TRUE;
		
		//remove pk on set
		if (isset($params['set']['_id']))
		{
			unset($params['set']['_id']);
		}
		
		//move data to update to $set command
		$params['set'] = array('$set'=> $params['set']);
		
		if (isset($params['where']['_id']) && is_string($params['where']['_id']) && $params['fix_id'] !== FALSE && ((string) new MongoId($params['where']['_id'])) === $params['where']['_id'])
		{
			$params['where']['_id'] = new MongoId($params['where']['_id']);
		}		
		if (isset($params['limit']))
		{
			$multiple = (((int) $params['limit']) > 1) ? TRUE : FALSE;
		}
		else
		{
			$multiple = TRUE;
		}
		
		//select collection
		$this->set_coll($params['into']);		
		
		// Set the update options
		$update_options = array('upsert' => FALSE, 'multiple' => $multiple, 'safe' => $params['safe'], 'fsync' => $params['safe']);
		try 
		{
			//run the update
			$update = $this->mongocoll->update($params['where'], $params['set'], $update_options);
			//increment update count
			$this->updates++;
			//if safe, we can get the affected rows
			if ($params['safe'])
			{
				return $update['n'];
			}
			//if not safe, we assume it worked
			else 
			{
				return TRUE;
			}
		} 
		catch (MongoCursorTimeoutException $e) 
		{
			$this->set_error($e);
			return FALSE;
		} 
		catch (MongoCursorException $e)
		{
			$this->set_error($e);
			return FALSE;
		}	
	}	
	
	/**
	  * @param string $from required table name
	  * @param array $where = NULL format: array($col => $val)	 
	  * @param int $limit = NULL
	  * @param bool|int $safe = $this->safe	  
	  * @param bool $fsync = this->fsync	  	  
	  * @returns mixed (bool === FALSE if failed || int of affected records)	  
	  */
	public function driver_delete($params = array()) 
	{
		//create connection if not set
		if (is_null($this->connection))
		{
			$connected = $this->connect();
			if (!$connected)
			{
				return FALSE;
			}
		}	
		$params['safe'] = (isset($params['safe'])) ? $params['safe'] : $this->safe;
		$params['fsync'] = (isset($params['fsync'])) ? $params['fsync'] : $this->fsync;
		$params['where'] = (isset($params['where'])) ? $params['where'] : array();			
		$params['fix_id'] = (isset($params['fix_id'])) ? $params['fix_id'] : TRUE;
		
		if (isset($params['where']['_id']) && is_string($params['where']['_id']) && $params['fix_id'] !== FALSE && ((string) new MongoId($params['where']['_id'])) === $params['where']['_id'])
		{
			$params['where']['_id'] = new MongoId($params['where']['_id']);
		}				
		if (isset($params['limit']))
		{
			$justOne = (((int) $params['limit']) == 1) ? TRUE : FALSE;
		}
		else
		{
			$justOne = FALSE;
		}
		
		//select collection
		$this->set_coll($params['from']);		
		
		// Set the update options
		$remove_options = array('justOne' => $justOne, 'safe' => $params['safe'], 'fsync' => $params['safe']);
		try 
		{
			//run the update
			$remove = $this->mongocoll->remove($params['where'], $remove_options);
			//increment update count
			$this->deletes++;
			//if safe, we can get the affected rows
			if ($params['safe'])
			{
				return $remove['n'];
			}
			//if not safe, we assume it worked
			else 
			{
				return TRUE;
			}
		} 
		catch (MongoCursorTimeoutException $e) 
		{
			$this->set_error($e);
			return FALSE;
		} 
		catch (MongoCursorException $e)
		{
			$this->set_error($e);
			return FALSE;
		}	

	}	
	
	/**
	  * @param array $result required 
	  * @returns int row count of rows affected
	  */
	public function driver_affected_rows($result) 
	{
		return (is_array($result) && isset($result['n'])) ? $result['n'] : NULL ;
	}
	
	/**
	  * @returns mixed last inserted id
	  */
	public function driver_insert_id() 
	{
		return $this->last_id;
	}
	
	/**
	  *
	  * @returns array('code'=> $code, 'message'=> $message)	  
	  */
	public function driver_error($params = array()) 
	{
	
	}	
	
	/**
	  *
	  * @returns mixed (value is used to insert a datetime value into a db.  can be string, int, or object) 
	  */
	public function driver_datetime_todb($params = array()) 
	{
	
	}

	/**
	  *
	  * @returns unix timestamp of a datetime from the db
	  */
	public function driver_datetime_fromdb($params = array()) 
	{
	
	}
	
	
	/**
	  *
	  * @returns mixed (value is used to insert a microtime value into a db.  can be string, int, or object) 
	  */
	public function driver_microtime_todb($params = array()) 
	{
	
	}	
	
	/**
	  *
	  * @returns unix micro timestamp of a microtime from the db
	  */
	public function driver_microtime_fromdb($params = array()) 
	{
	
	}	
	
	/**
      * Mongo->selectCollection implementation
      */
    public function set_coll($coll) 
	{
		if ($this->coll != $coll) 
		{
			if ($this->mongocoll = $this->mongodb->selectCollection($coll)) 
			{
				$this->coll = $coll;
				return TRUE;
			}
		}
		return FALSE;
	}
}
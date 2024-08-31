<?php
namespace api\actions;
use Yii;

class AsteriskmanagerAction
{

    var $socket = NULL;
    var $server;
    var $host = '*';
    var $user = '*';
    var $secret = '*';
    var $port;

    function send_request($action, $parameters=array()) {

        $command = "Action: $action\r\n";
        foreach($parameters as $var=>$val) {
            $command .= "$var: $val\r\n";
        }
        $command .= "\r\n";

        fwrite($this->socket, $command);

        return $this->get_response(true);
    
    }

    function get_response($allow_timeout=false) {
        $timeout = false;
        do {
            $type = NULL;
            $parameters = array();

            if (feof($this->socket)) {
                return false;
            }
            $buffer = trim(fgets($this->socket, 4096));
            while($buffer != '') {
                $a = strpos($buffer, ':');
                if($a) {
                    if(!count($parameters)) { // first line in a response?
                        $type = strtolower(substr($buffer, 0, $a));
                        if(substr($buffer, $a + 2) == 'Follows') {
                            // A follows response means there is a multiline field that follows.
                            $parameters['data'] = '';
                            $buff = fgets($this->socket, 4096);
                            while(substr($buff, 0, 6) != '--END ') {
                                $parameters['data'] .= $buff;
                                $buff = fgets($this->socket, 4096);
                            }
                        }
                    }

                    // store parameter in $parameters
                    $parameters[substr($buffer, 0, $a)] = substr($buffer, $a + 2);
                }
                $buffer = trim(fgets($this->socket, 4096));
            }

            // process response
            switch($type) {
                case '': // timeout occured
                    $timeout = $allow_timeout;
                    break;
                case 'event':
                    // Process event with $parameters ?
                    break;
                case 'response':
                    break;
                default:
                    // $this->log('Unhandled response packet from Manager: ' . print_r($parameters, true));
                    break;
            }
        } while($type != 'response' && !$timeout);
        return $parameters;
    }

    function connect() {
        // Extract port if specified
        $server = $this->host;

        if(strpos($server, ':') !== false) {
            $parts = explode(':', $server);
            $this->server = $parts[0];
            $this->port   = $parts[1];
        } else {
            $this->server = $server;
            $this->port = "5038";
        }

        $errno = $errstr = NULL;

        $this->socket = @fsockopen($this->server, $this->port, $errno, $errstr,1);

        if(!$this->socket) {
            $this->log("Unable to connect to manager {$this->server}:{$this->port} ($errno): $errstr");
            return false;
        }

        // read the header
        $str = fgets($this->socket);
        if($str == false) {
            $this->log("Asterisk Manager header not received.");
            return false;
        }
        // login
        $res = $this->send_request('login', array('Username'=>$this->user, 'Secret'=>$this->secret));

        if(false) {
            $this->log("Failed to login.");
            $this->disconnect();
            return false;
        }
        return true;
    }

    function disconnect() {
        $this->logoff();
        fclose($this->socket);
    }

    function Command($command) {
        return $this->send_request('Command', array('Command'=>$command));
    }

    function ExtensionState($exten, $context='', $actionid='') {
        return $this->send_request('ExtensionState', array('Exten'=>$exten, 'Context'=>$context, 'ActionID'=>$actionid));
    }

    function Hangup($channel) {
        return $this->send_request('Hangup', array('Channel'=>$channel));
    }

    function Logoff() {
        return $this->send_request('Logoff');
    }

    function log($message, $level=1)
    {
        error_log(date('r') . ' - ' . $message);
    }
}